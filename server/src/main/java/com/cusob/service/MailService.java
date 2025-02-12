package com.cusob.service;

import com.cusob.entity.Sender;

import java.util.Date;

public interface MailService {

    /**
     * 发送纯文本邮件
     * @param to
     * @param subject
     * @param text
     */
    void sendTextMailMessage(String to,String subject,String text);

    /**
     * 发送Html邮件
     * @param to
     * @param subject
     * @param content
     */
    void sendHtmlMailMessage(String to,String subject,String content);

    /**
     * send email
     * @param sender
     * @param senderName
     * @param to
     * @param content
     * @param subject
     */
    void sendEmail(Sender sender, String senderName, String to, String content, String subject,String unsubscribeUrl,Long groupId,Long campaignId);

    /**
     * send email by simple-java-mail
     * @param sender
     * @param senderName
     * @param to
     * @param content
     * @param subject
     */
    void sendSimpleEmail(Sender sender, String senderName, String to, String content, String subject);

}
