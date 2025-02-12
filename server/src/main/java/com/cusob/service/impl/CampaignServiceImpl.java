package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.constant.MqConst;
import com.cusob.dto.CampaignDto;
import com.cusob.dto.CampaignQueryDto;
import com.cusob.entity.*;
import com.cusob.exception.CusobException;
import com.cusob.mapper.CampaignMapper;
import com.cusob.result.Result;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.*;
import com.cusob.vo.CampaignListVo;
import io.swagger.models.auth.In;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.net.URLEncoder;
import java.util.*;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Service
public class CampaignServiceImpl extends ServiceImpl<CampaignMapper, Campaign> implements CampaignService {

    @Autowired
    private ContactService contactService;

    @Autowired
    private MailService mailService;

    @Autowired
    private SenderService senderService;

    @Autowired
    private CompanyService companyService;

    @Value("${cusob.host}")
    private String baseUrl;

    @Autowired
    private PlanPriceService planPriceService;
    @Autowired
    private PriceService priceService;
    @Resource
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private UnsubscribeService unsubscribeService;

    @Autowired
    private CampaignContactService campaignContactService;

    @Autowired
    private AccountInfoService accountInfoService;

    @Autowired
    private ReportService reportService;

    @Value("${cusob.url}")
    private String host;
    //获取最新id
    public Long getLastCampaignId(){
        Long lastCampaignId = baseMapper.getLastCampaignId();
        return lastCampaignId+1;
    }

    /**
     * save Campaign Draft
     * @param campaignDto
     */
    @Override
    public Long saveCampaign(CampaignDto campaignDto, Integer status) {//保存活动
        Campaign campaign = new Campaign();
        BeanUtils.copyProperties(campaignDto, campaign);

        campaign.setUserId(AuthContext.getUserId());
        campaign.setStatus(status);
        baseMapper.insert(campaign);
        return campaign.getId();
    }

    /**
     * get Campaign By Id
     * @param id
     * @return
     */
    @Override
    public Campaign getCampaignById(Long id) {
        Campaign campaign = baseMapper.selectById(id);
        return campaign;
    }

    /**
     * update Campaign
     * @param campaignDto
     */
    @Override
    public void updateCampaign(CampaignDto campaignDto) {
        Campaign campaign = new Campaign();
        BeanUtils.copyProperties(campaignDto, campaign);
        campaign.setUserId(AuthContext.getUserId());
        campaign.setStatus(Campaign.DRAFT);
        baseMapper.updateById(campaign);
    }

    /**
     * get Campaign Page
     * @param pageParam
     * @param campaignQueryDto
     * @return
     */
    @Override
    public IPage<CampaignListVo> getCampaignPage(Page<Campaign> pageParam, CampaignQueryDto campaignQueryDto) {
        String name = campaignQueryDto.getName();
        Integer status = campaignQueryDto.getStatus();
        Integer order = campaignQueryDto.getOrder();
        Long userId = AuthContext.getUserId();
        IPage<CampaignListVo> pageModel = baseMapper.getCampaignPage(pageParam, userId, name, status, order);
        return pageModel;
    }

    /**
     * send Email
     * @param campaignDto
     */
    @Override
    public void sendEmail(CampaignDto campaignDto) {//发送邮件，重要功能
        Company company = companyService.getById(AuthContext.getCompanyId());//获取公司信息
        Price plan = priceService.getPlanById(company.getPlanId());//获取订阅计划信息
        Long groupId = campaignDto.getToGroup();

        List<Contact> contactList = contactService.getListByGroupId(groupId);//获取该campaign要发送的组的联系人列表
        // Whether the limit of e-mails that can be sent is exceeded
        if (company.getEmails() + contactList.size() >= plan.getEmailCapacity()){//超出发送数量
            throw new CusobException(ResultCodeEnum.EMAIL_NUMBER_FULL);//邮件数量已满
        }
        // Parameter validation
        this.paramVerify(campaignDto);//参数验证
        Long campaignId;//活动id
        if(campaignDto.getId()==0 && this.getCampaignByname(campaignDto.getCampaignName())!=null){//判断活动名称是否存在
            throw new CusobException(ResultCodeEnum.TITLE_IS_EXISTED);//标题已存在
        }
        Campaign campaign = this.getCampaignById(campaignDto.getId());//获取活动
        if (campaign != null){//活动存在
            campaignId = campaign.getId();//获取活动id
            this.saveCampaign(campaignDto, Campaign.ONGOING);//保存活动
        }else {//活动不存在
            campaignId = this.saveCampaign(campaignDto, Campaign.ONGOING);//保存活动
            campaign = this.getCampaignById(campaignId);//获取活动
        }

        Report report = new Report();//报告
        report.setUserId(AuthContext.getUserId());//用户id
        report.setCompanyId(AuthContext.getCompanyId());
        report.setCampaignId(campaignId);
        report.setGroupId(groupId);
        report.setDeliverCount(contactList.size());
        // Generate reports
        reportService.saveReport(report);

        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_REPORT_DIRECT,
                MqConst.ROUTING_SAVE_REPORT, report);
        // save campaign contact
        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_CAMPAIGN_DIRECT,
                MqConst.ROUTING_CAMPAIGN_CONTACT, report);//
        // Email contacts
        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_MAIL_DIRECT,
                MqConst.ROUTING_MASS_MAILING, campaign);
    }

    @Override
    public List<Contact> getSendList(Long groupId) {
        return contactService.getListByGroupId(groupId);
    }

    /**
     * remove Campaign
     * @param id
     */
    @Override
    public void removeCampaign(Long id) {
        baseMapper.deleteById(id);
    }

    /**
     * Mass Mailing
     * @param campaign
     */


    @Override
    public void MassMailing(Campaign campaign) {//正式批量发送邮件
        String campaignName = campaign.getCampaignName();
        Campaign campaign1 = baseMapper.selectOne(new LambdaQueryWrapper<Campaign>()
                .eq(Campaign::getUserId, AuthContext.getUserId())
                .eq(Campaign::getCampaignName, campaignName)
        );
        if(campaign1 != null){
            campaign.setCampaignName(campaignName + System.currentTimeMillis());
        }
        Long senderId = campaign.getSenderId();
        Sender sender = senderService.getById(senderId);
        String senderName = campaign.getSenderName();
        String subject = campaign.getSubject();
        String content = campaign.getContent();
        Long userId = campaign.getUserId();
        Long groupId = campaign.getToGroup();
        List<Contact> contactList = contactService.getListByUserIdAndGroupId(userId, groupId);
        //List<String> emailList = unsubscribeService.selectEmailList();//获取退订列表

        Random random = new Random();
        long totalTime = 1;
        for (Contact contact : contactList) {
            String email = contact.getEmail();
            if (!contact.getSubscriptionType().equals("Unsubscribed") && contact.getValid() == 1 && contact.getIsAvailable() == 1){ //判断是否退订、邮箱是否有效、是否可用
                String replace = content.replace("#{FIRSTNAME}", contact.getFirstName()==null ? "#{FIRSTNAME}":contact.getFirstName())
                        .replace("#{LASTNAME}", contact.getLastName()==null ? "#{LASTNAME}":contact.getLastName())
                        .replace("#{COMPANY}",contact.getCompany()==null ? "#{COMPANY}":contact.getCompany())
                        .replace("#{EMAIL}",contact.getEmail()==null ? "#{EMAIL}":contact.getEmail())
                        .replace("#{TITLE}",contact.getTitle()==null ? "#{TITLE}":contact.getTitle())
                        .replace("#{BIRTHDATE}",contact.getBirthDate()==null ? "#{BIRTHDATE}":contact.getBirthDate().toString())
                        .replace("#{PHONE}",contact.getBirthDate()==null ? "#{PHONE}":contact.getPhone())
                        .replace("#{DEPT}",contact.getBirthDate()==null ? "#{DEPT}":contact.getDept())
                        //动态替换收件人信息
                        ;
                String addr = accountInfoService.getAddr(userId);
                String style = "        <style>.footer {\n" +
                        "            padding-top: 0; \n" +
                        "            padding-bottom: 20px; \n" +
                        "            text-align: center;\n" +
                        "            font-size: 14px;\n" +
                        "            color: #999;\n" +
                        "        }\n" +
                        "        .footer p {\n" +
                        "            margin: 5px 0;\n" +
                        "        }</style>";
//                String img = "<img style=\"display: none;\" src=\"" + baseUrl + "/read/count/"
//                        + campaign.getId() + "/" + contact.getId() + "\">"; //加入一个不可见图片用于追踪打开率
//                String img = "<img style=\"width:1px;height:1px;background-color:#FF0000;\" src=\""
//                        + baseUrl
//                        + "/read/count/"
//                        + campaign.getId()
//                        + "/"
//                        + contact.getId() + "\" alt=\"\">";
// 使用 StringBuilder 来构建 img 标签内容
                // 手动对特殊字符进行编码替换
//                String img = "<img style=\"width:1px;height:1px;background-color:#FF0000;\" src=\""
//                        + baseUrl.replace("=", "&#61;")
//                        + "/read/count/"
//                        + campaign.getId()
//                        + "/"
//                        + contact.getId()
//                        + "\" alt=\"\">";
                String url=baseUrl + "/read/count/" + campaign.getId() + "/" + contact.getId();
                //String img = "<img  src=\""+ "https://gitee.com/jadeinrain/athena-blog-img/raw/f9e39c2309398832ea5083fd03274c8fa13d9552/athena.JPG\" "+ "alt=\"\">";
                String img = "<img  src=\""+ url+ "\" alt=\"\">";
                System.out.println("img: " + img);

//                String encode = Base64.getEncoder().encodeToString(email.getBytes());
                String unsubscribeUrl = host + "/unsubscribe?email=" + email;
                String btnUnsubscribe = "<a href=\"" + unsubscribeUrl +"\">\n" +
                        "    <div style=\"text-align: center; margin-top: 20px;\">\n" +
                        "        <button style=\"border-radius: 4px; height: 30px; color: white; border: none; background-color: #e7e7e7;\">Unsubscribe</button>\n" +
                        "    </div>\n" +
                        "</a>"; //加入退订链接

                String address = "    <div class=\"footer\">\n" +
                        "        <p>" + addr + "</p>\n" +
                        "    </div>";
                String emailContent = style + replace + btnUnsubscribe + address + img ;
                ScheduledThreadPoolExecutor executor =
                        new ScheduledThreadPoolExecutor(2, new ThreadPoolExecutor.CallerRunsPolicy());
                executor.schedule(() -> {//定时发送邮件
                    mailService.sendEmail(sender, senderName, email, emailContent, subject,unsubscribeUrl,groupId,campaign.getId());
                    campaignContactService.updateSendStatus(campaign.getId(), contact.getId());//更新campaign_contact表中发送状态,设置为已发送
                    reportService.updateDeliveredCount(campaign.getId());//更新report表中发送数量
                }, totalTime, TimeUnit.MILLISECONDS);//定时发送
                executor.shutdown();
                totalTime += 1000*(random.nextInt(10) + 10);//随机时间间隔

            }

        }

    }


    /**
     * update Status
     */
    @Override
    public void updateStatus(Long campaignId, Integer status) {
        Campaign campaign = baseMapper.selectById(campaignId);
        if (campaign != null){
            campaign.setStatus(status);
            baseMapper.updateById(campaign);
        }
    }

    @Override
    public Campaign getCampaignByname(String campaignName) {
        return baseMapper.getCampaignByname(campaignName);
    }


    private void paramVerify(CampaignDto campaignDto) {
        if (!StringUtils.hasText(campaignDto.getSenderName())){
            throw new CusobException(ResultCodeEnum.SENDER_NAME_EMPTY);
        }
        if (campaignDto.getSenderId() == null){
            throw new CusobException(ResultCodeEnum.SENDER_IS_EMPTY);
        }
        if (campaignDto.getToGroup()==null){
            throw new CusobException(ResultCodeEnum.RECIPIENT_IS_EMPTY);
        }
        if (!StringUtils.hasText(campaignDto.getSubject())){
            throw new CusobException(ResultCodeEnum.SUBJECT_IS_EMPTY);
        }
        if (!StringUtils.hasText(campaignDto.getContent())){
            throw new CusobException(ResultCodeEnum.CONTENT_IS_EMPTY);
        }
        if (campaignDto.getSendTime() == null){
            throw new CusobException(ResultCodeEnum.SEND_TIME_EMPTY);
        }

    }

}
