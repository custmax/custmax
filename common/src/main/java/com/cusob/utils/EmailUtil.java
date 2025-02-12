package com.cusob.utils;

import org.simplejavamail.api.email.Email;
import org.simplejavamail.api.mailer.Mailer;
import org.simplejavamail.api.mailer.config.TransportStrategy;
import org.simplejavamail.email.EmailBuilder;
import org.simplejavamail.mailer.MailerBuilder;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class EmailUtil {

    public static void sendEmail(){
        String domain = "chtrak.com";
        String selector = "s2";
        String url = "https://test-daybreak.oss-cn-shanghai.aliyuncs.com/cusob/dkim/private_key.der";
        InputStream inputStream = getFileInputStream(url);

        Email email = EmailBuilder.startingBlank()
                .from("TL", "tim@chtrak.com")
                .to("ming", "941563132@qq.com")
                .withPlainText("Please view this email in a modern email client!")
                .withSubject("Hello ming,nice to meet you!")
                .signWithDomainKey(inputStream, domain, selector)
                .buildEmail();

        Mailer mailer = MailerBuilder
                .withSMTPServerHost("smtp.feishu.cn")
                .withSMTPServerPort(465)
                .withSMTPServerUsername("daybreak@chtrak.com")
                .withSMTPServerPassword("lzTPdotqdzcJ1FT1")
                .withTransportStrategy(TransportStrategy.SMTPS)
                .buildMailer();

        mailer.sendMail(email);
    }

    /*读取网络文件*/
    public static InputStream getFileInputStream(String path) {
        URL url = null;
        try {
            url = new URL(path);
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            //设置超时间为3秒
            conn.setConnectTimeout(3*1000);
            //防止屏蔽程序抓取而返回403错误
            conn.setRequestProperty("User-Agent", "Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt)");
            //得到输入流
            return conn.getInputStream();
        } catch (Exception e) {
            System.out.println(e);
        }
        return null;
    }

    public static void sendCommand(PrintWriter writer, String command) throws IOException {
        writer.println(command);
        writer.flush();
    }

    public static String readResponse(BufferedReader reader) throws IOException {
        String response = reader.readLine();
        System.out.println("Server response: " + response);
        return response;
    }


    public static void main(String[] args) {
        sendEmail();
    }
}
