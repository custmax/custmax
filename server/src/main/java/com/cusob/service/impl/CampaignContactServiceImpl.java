package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.entity.CampaignContact;
import com.cusob.entity.Contact;
import com.cusob.mapper.CampaignContactMapper;
import com.cusob.service.CampaignContactService;
import com.cusob.service.ContactService;
import com.cusob.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CampaignContactServiceImpl
        extends ServiceImpl<CampaignContactMapper, CampaignContact>
        implements CampaignContactService {

    @Autowired
    private ContactService contactService;

    @Autowired
    private ReportService reportService;

    /**
     * Read Count
     * @param campaignId
     * @param contactId
     */
    @Transactional
    @Override
    public void opened(Long campaignId, Long contactId) {//8.15修改，现在是批量查询
        List<CampaignContact> campaignContacts = baseMapper.selectList(//查询符合条件的记录
                new LambdaQueryWrapper<CampaignContact>()
                        .eq(CampaignContact::getCampaignId, campaignId)
                        .eq(CampaignContact::getContactId, contactId)
        );
        for (CampaignContact campaignContact : campaignContacts) {
            if (!campaignContact.getIsOpened().equals(CampaignContact.OPENED)){//如果这个联系人的状态不是已打开
                campaignContact.setIsOpened(CampaignContact.OPENED);//设置为已打开
                baseMapper.updateById(campaignContact);//更新记录
                reportService.opened(campaignId);//更新报告
            }
        }
//        if (contact != null){
//            if (!contact.getIsOpened().equals(CampaignContact.OPENED)){
//                contact.setIsOpened(CampaignContact.OPENED);
//                baseMapper.updateById(contact);
//                reportService.opened(campaignId);
//            }
//        }

    }

    /**
     * batch Save Contact
     * @param campaignId
     * @param groupId
     */
    @Override
    public void batchSaveContact(Long userId, Long campaignId, Long groupId) {
        List<Contact> contactList = contactService.getListByUserIdAndGroupId(userId, groupId);//根据当前用户id和组id获取这次发送邮件的联系人列表
        List<CampaignContact> campaignContactList = new ArrayList<>();//创建一个空的CampaignContact列表
        for (Contact contact : contactList) {
            CampaignContact campaignContact = new CampaignContact();//这个表用于记录每个联系人的发送状态，以及campaign和contact的关联信息
            campaignContact.setCampaignId(campaignId);
            campaignContact.setContactId(contact.getId());
            campaignContactList.add(campaignContact);
        }
        // todo 待优化，8.14由单个查询改为列表查询修改
        campaignContactList.forEach(campaignContact -> baseMapper.insert(campaignContact));
    }

    /**
     * update Send Status
     * @param campaignId
     * @param contactId
     */
    @Override
    public void updateSendStatus(Long campaignId, Long contactId) {//更新发送状态
        // 查询所有符合条件的记录
        List<CampaignContact> campaignContacts = baseMapper.selectList(
                new LambdaQueryWrapper<CampaignContact>()
                        .eq(CampaignContact::getCampaignId, campaignId)
                        .eq(CampaignContact::getContactId, contactId)
        );

        // 遍历所有符合条件的记录，逐个更新
        for (CampaignContact campaignContact : campaignContacts) {
            campaignContact.setIsDelivered(CampaignContact.DELIVERED); // 设置为已发送
            baseMapper.updateById(campaignContact); // 更新记录
        }
    }
}
