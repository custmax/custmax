package com.cusob.service.test;

import com.cusob.entity.Campaign;
import com.cusob.entity.Sender;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Properties;
import java.util.UUID;

public class SampleMail {

    protected static String genMessageID(String mailFrom) {
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

    public static void sendEmail(Sender sender, String to, String content, String subject){

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
            InternetAddress from = new InternetAddress(email, email);
            message.setFrom(from);
            message.setSentDate(new Date()); // 设置时间 todo 目前立即发送
            //设置邮件标题
            message.setSubject(subject);
            message.setContent(content, "text/html;charset=UTF-8");
            message.setRecipients(Message.RecipientType.TO, to);

            // 发送邮件
            Transport.send(message);
            System.out.println("success");

        } catch (MessagingException e) {
            String err = e.getMessage();
            System.out.println(err);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {

        Sender sender = new Sender();
        sender.setEmail("daybreak@chtrak.com");
        sender.setPassword("lzTPdotqdzcJ1FT1");
        sender.setSmtpServer("smtp.feishu.cn");
        sender.setSmtpPort(465);
        String toEmail = "m202373514@hust.edu.cn";
        sendEmail(sender, toEmail, "yyds", "test");
    }
}
