package com.cusob.service.impl;

import com.cusob.entity.Sender;
import com.cusob.exception.CusobException;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.ContactService;
import com.cusob.service.MailService;
import com.cusob.service.ReportService;
import com.sun.mail.smtp.SMTPSendFailedException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Properties;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class MailServiceImpl implements MailService {

    /**
     * 注入邮件工具类
     */
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private ContactService contactService;

    @Autowired
    private ReportService reportService;

    @Value("${spring.mail.username}")
    private String mailSender;

    @Value("${spring.mail.host}")
    private String smtpServer;

    @Value("${spring.mail.port}")
    private Integer smtpPort;

    @Value("${spring.mail.password}")
    private String password;

    /**
     * 检测邮件信息类
     * @param to
     * @param subject
     * @param text
     */
    private void checkMail(String to,String subject,String text){
        if(StringUtils.isEmpty(to)){//如果收件人为空
            throw new CusobException(ResultCodeEnum.EMAIL_RECIPIENT_EMPTY);//收件人为空
        }
        boolean flag = Pattern.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", to);
        if (!flag){
            throw new CusobException(ResultCodeEnum.EMAIL_FORMAT_ERROR);//邮箱格式错误
        }
        if(StringUtils.isEmpty(subject)){
            throw new CusobException(ResultCodeEnum.EMAIL_SUBJECT_EMPTY);//邮件主题为空
        }
        if(StringUtils.isEmpty(text)){
            throw new CusobException(ResultCodeEnum.EMAIL_CONTENT_EMPTY);//邮件内容为空
        }
    }

    /**
     * 发送纯文本邮件
     * @param to
     * @param subject
     * @param text
     */
    @Override
    public void sendTextMailMessage(String to,String subject,String text){
        this.checkMail(to, subject, text);
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            //true 代表支持复杂的类型
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage,true);
            //邮件发信人
            mimeMessageHelper.setFrom(mailSender);
            //邮件收信人  1或多个
            mimeMessageHelper.setTo(to.split(","));
            //邮件主题
            mimeMessageHelper.setSubject(subject);
            //邮件内容
            mimeMessageHelper.setText(text, true);
            //邮件发送时间
            mimeMessageHelper.setSentDate(new Date());
            //发送邮件
            javaMailSender.send(mimeMessageHelper.getMimeMessage());
        } catch (Exception e) {
            throw new CusobException(ResultCodeEnum.EMAIL_SEND_FAIL);
        }
    }

    /**
     * 发送Html邮件
     * @param to
     * @param subject
     * @param content
     */
    @Override
    public void sendHtmlMailMessage(String to, String subject, String content) {//激活邮件
        this.checkMail(to, subject, content);

        // 配置发送邮件的环境属性
        final Properties props = new Properties();

        // 表示SMTP发送邮件，需要进行身份验证
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.host", smtpServer);
        //加密方式：
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.socketFactory.port", smtpPort);
        props.put("mail.smtp.port", smtpPort);
        props.put("mail.smtp.from", mailSender);
        props.put("mail.user", mailSender);
        props.put("mail.password", password);
        props.setProperty("mail.smtp.ssl.enable", "true");

        // 构建授权信息，用于进行SMTP进行身份验证
        Authenticator authenticator = new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                // 用户名、密码
                String userName = props.getProperty("mail.user");
                String password = props.getProperty("mail.password");
                return new PasswordAuthentication(userName, password);
            }
        };

        // 使用环境属性和授权信息，创建邮件会话
        Session mailSession = Session.getInstance(props, authenticator);
        final String messageIDValue = genMessageID(props.getProperty("mail.user"));
        //创建邮件消息
        MimeMessage message = new MimeMessage(mailSession) {
            @Override
            protected void updateMessageID() throws MessagingException {
                //设置自定义Message-ID值
                setHeader("Message-ID", messageIDValue);//创建Message-ID
            }
        };

        try {
            InternetAddress from = new InternetAddress(mailSender, mailSender);
            message.setFrom(from);
            message.setSentDate(new Date()); // 设置时间
            //设置邮件标题
            message.setSubject(subject);
            message.setContent(content, "text/html");
            message.setRecipients(Message.RecipientType.TO, to);
            // 发送邮件
            Transport.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new CusobException(ResultCodeEnum.EMAIL_SEND_FAIL);
        }
        System.out.println("success");
    }

    protected String genMessageID(String mailFrom) {
        // message-id 必须符合 first-part@last-part
        String[] mailInfo = mailFrom.split("@");
        String domain = mailFrom;
        int index = mailInfo.length - 1;
        if (index >= 0) {
            domain = mailInfo[index];
        }
        UUID uuid = UUID.randomUUID();
        StringBuffer messageId = new StringBuffer();
        messageId.append('<').append(uuid.toString()).append('@').append(domain).append('>');
        return messageId.toString();
    }

    /**
     * send Email SetTime
     * @param sender
     * @param senderName
     * @param to
     * @param content
     * @param subject
     */
    @Override
    public void sendEmail(Sender sender, String senderName, String to, String content,
                          String subject,String unsubscribeUrl,Long groupId,Long campaignId) {
        String email = sender.getEmail();
        String password = sender.getPassword();
        String smtpServer = sender.getSmtpServer();
        Integer smtpPort = sender.getSmtpPort();

        // 配置发送邮件的环境属性
        final Properties props = new Properties();

        // 表示SMTP发送邮件，需要进行身份验证
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.host", smtpServer);
        //加密方式：
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.socketFactory.port", smtpPort);
        props.put("mail.smtp.port", smtpPort);
        props.put("mail.smtp.from", email);
        props.put("mail.user", email);
        props.put("mail.password", password);
        props.setProperty("mail.smtp.ssl.enable", "true");

        // 构建授权信息，用于进行SMTP进行身份验证
        Authenticator authenticator = new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                // 用户名、密码
                String userName = props.getProperty("mail.user");
                String password = props.getProperty("mail.password");
                return new PasswordAuthentication(userName, password);
            }
        };

        // 使用环境属性和授权信息，创建邮件会话
        Session mailSession = Session.getInstance(props, authenticator);
        mailSession.setDebug(true);
        final String messageIDValue = genMessageID(props.getProperty("mail.user"));
//        创建邮件消息
        MimeMessage message = new MimeMessage(mailSession) {
            @Override
            protected void updateMessageID() throws MessagingException {
                //设置自定义Message-ID值
                setHeader("Message-ID", messageIDValue);//创建Message-ID
            }
        };

        try {
            InternetAddress from = new InternetAddress(email, senderName);
            message.setFrom(from);
            message.setSentDate(new Date()); // 设置时间
            //设置邮件标题
            message.setSubject(subject);
//            message.setContent(content, "text/html;charset=UTF-8");
            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(content, "text/html;charset=UTF-8");
            mimeBodyPart.setHeader("Content-Transfer-Encoding", "7bit");

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            message.setContent(multipart);

            message.setRecipients(Message.RecipientType.TO, to);
//            message.setHeader("Return-Receipt-To", email);
//            message.setHeader("Disposition-Notification-To", email);
//            message.setHeader("X-Confirm-Reading-To", email);
            message.setHeader("List-Unsubscribe-Post","List-Unsubscribe=One-Click"); //添加一键退订的Header
            message.setHeader("List-Unsubscribe", "<" + unsubscribeUrl + ">");
            // 发送邮件
            System.out.println(message.getContent());
            Transport.send(message);
            System.out.println(to);

        } catch (MessagingException | UnsupportedEncodingException e) {
            if (e instanceof SMTPSendFailedException) {
                // 处理 SMTPSendFailedException 类型的异常
                SMTPSendFailedException smtpSendFailedException = (SMTPSendFailedException) e;
                int smtpErrorCode = ((SMTPSendFailedException) e).getReturnCode();
                if(smtpErrorCode == 550){  //如果为硬弹回
                    reportService.updateHardBounceCount(campaignId);
                    contactService.updateByEmail(to,groupId,sender.getUserId(),0); //将该邮件valid设置为0
                }
                System.out.println("SMTPSendFailedException: " + smtpSendFailedException.getMessage());
            }
            e.printStackTrace();
            throw new CusobException(ResultCodeEnum.EMAIL_SEND_FAIL);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        System.out.println("success");
    }

    /**
     * send email by simple-java-mail
     * @param sender
     * @param senderName
     * @param to
     * @param content
     * @param subject
     */
    @Override
    public void sendSimpleEmail(Sender sender, String senderName, String to, String content, String subject) {

    }


}
