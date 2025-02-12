package com.cusob.receiver;

import cn.hutool.core.convert.impl.TimeZoneConverter;
import com.cusob.constant.MqConst;
import com.cusob.dto.CampaignDto;
import com.cusob.entity.Campaign;
import com.cusob.entity.Report;
import com.cusob.service.CampaignContactService;
import com.cusob.service.CampaignService;
import com.cusob.service.CompanyService;
import com.cusob.service.ReportService;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.util.Date;
import java.util.TimeZone;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Component
public class CampaignReceiver {

    @Autowired
    private ReportService reportService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CampaignContactService campaignContactService;

    @Autowired
    private CampaignService campaignService;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = MqConst.QUEUE_SAVE_REPORT, durable = "true"),
            exchange = @Exchange(value = MqConst.EXCHANGE_REPORT_DIRECT),
            key = {MqConst.ROUTING_SAVE_REPORT}
    ))
    public void generateReports(Report report, Message message, Channel channel) throws IOException {
        if (report!=null){
//            reportService.saveReport(report);
            companyService.updateEmails(report.getCompanyId(), report.getDeliverCount());//更新用户所在公司已发送的邮件数量，即加上这次发送的邮件数量
        }
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = MqConst.QUEUE_CAMPAIGN_CONTACT, durable = "true"),
            exchange = @Exchange(value = MqConst.EXCHANGE_CAMPAIGN_DIRECT),
            key = {MqConst.ROUTING_CAMPAIGN_CONTACT}
    ))
    public void saveCampaignContact(Report report, Message message, Channel channel) throws IOException {
        if (report!=null){
            System.out.println("save Campaign Contact");
            campaignContactService.batchSaveContact(report.getUserId(), report.getCampaignId(), report.getGroupId());//保存这次发送邮件的联系人列表
        }
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
    }


    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = MqConst.QUEUE_MASS_MAILING, durable = "true"),
            exchange = @Exchange(value = MqConst.EXCHANGE_MAIL_DIRECT),
            key = {MqConst.ROUTING_MASS_MAILING}
    ))
    public void massMailing(Campaign campaign, Message message, Channel channel) throws IOException {
        try {
            if (campaign!=null){
                String timeZoneStr = campaign.getTimeZone();
                Date sendTime = campaign.getSendTime();


                //将当前时间转化为对应时区的时间，如果当前时间晚于发送时间，立即发送，否则延迟发送
                TimeZoneConverter converter = new TimeZoneConverter();
                // 当前时间
                Date now = new Date();

                // 将当前时间转换为东八区 (UTC+8)
                Instant instant = now.toInstant();
                // 转换为指定时区的ZonedDateTime
                ZonedDateTime zonedDateTime = instant.atZone(ZoneId.of(timeZoneStr));
                Date nowDate = Date.from(zonedDateTime.toInstant());
                System.out.println("东八区时间: " + nowDate);//这是当前时间
                System.out.println("sendTime: " + sendTime);

                if (nowDate.after(sendTime)){//如果当前时间晚于发送时间，立即发送
                    campaignService.MassMailing(campaign);
                    campaignService.updateStatus(campaign.getId(), Campaign.COMPLETED); //更新发送状态
                }else {
                    long delay = sendTime.getTime() - nowDate.getTime();
                    ScheduledThreadPoolExecutor executor =
                            new ScheduledThreadPoolExecutor(2, new ThreadPoolExecutor.CallerRunsPolicy());
                    executor.schedule(() -> {
                        campaignService.MassMailing(campaign);
                        campaignService.updateStatus(campaign.getId(), Campaign.COMPLETED);
                    }, delay, TimeUnit.MILLISECONDS);
                    executor.shutdown();
                }

            }
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        }

    }


}
