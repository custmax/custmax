package com.cusob.service.impl;

import com.cusob.result.Result;
import com.cusob.service.EmailVerifyService;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.Socket;
import java.util.*;
import java.util.logging.Logger;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.internet.InternetAddress;
import javax.mail.MessagingException;
import javax.naming.directory.InitialDirContext;
import javax.naming.directory.DirContext;
import javax.naming.directory.Attributes;
import javax.naming.Context;
import java.util.logging.Level;
@Service
public class EmailVerifyServiceImpl implements EmailVerifyService {
    private static final Logger logger = Logger.getLogger(EmailVerifyServiceImpl.class.getName());
    @Override
    public Result<Map<String, Boolean>> verifyEmail(List<String> emails) {
        Map<String, List<String>> emailDomains = new HashMap<>();
        Map<String, Boolean> finalResults = new HashMap<>();

        // Group emails by domain
        for (String email : emails) {
            String[] parts = email.split("@");
            String domain = parts[1];
            /*检查 emailDomains 中是否已经存在与 domain 相关的键。
              如果存在：返回该键对应的值（即一个包含邮箱地址的 List）。
              如果不存在：使用提供的函数 k -> new ArrayList<>() 创建一个新的 ArrayList，将其与 domain 键关联，并将这个新的 ArrayList 返回
              */
            emailDomains.computeIfAbsent(domain, k -> new ArrayList<>()).add(email);
        }

        // Verify each email group
        for (Map.Entry<String, List<String>> entry : emailDomains.entrySet()) {//entrySet()方法返回Map中所有键值对的集合,每个元素都是一个 Map.Entry
            String domain = entry.getKey();
            List<String> emailList = entry.getValue();
            try {
                List<String> mxRecords = fetchMXRecords(domain);

                if (mxRecords.isEmpty()) {//MX记录为空，返回false
                    logger.warning("No MX records found for domain: " + domain);
                    for (String email : emailList) {
                        finalResults.put(email, false);
                    }
                    continue;
                }
                //随机选择一个MX记录
                String mxHost = mxRecords.get(new Random().nextInt(mxRecords.size()));
                logger.info("Connecting to server: " + mxHost);

                // Establish SMTP connection using Socket
                try (Socket socket = new Socket(mxHost, 25);
                     BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                     BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()))) {

                    if (!readResponse(reader).startsWith("220")) {
                        throw new IOException("Failed to connect to SMTP server");
                    }

                    sendCommand(writer, reader, "HELO example.com");
                    sendCommand(writer, reader, "MAIL FROM:<hello@cusob.com>");

                    for (String email : emailList) {
                        String rcptResponse = sendCommand(writer, reader, "RCPT TO:<" + email + ">");
                        if (rcptResponse.startsWith("250") || rcptResponse.startsWith("451")) {
                            finalResults.put(email, true); // Exists
                        } else if (rcptResponse.startsWith("550")) {
                            finalResults.put(email, false); // Does not exist
                        } else {
                            finalResults.put(email, null); // Unknown
                        }
                    }
                    sendCommand(writer, reader, "QUIT");
                }

            } catch (Exception e) {
                logger.severe("Error verifying emails for domain: " + domain + " - " + e.getMessage());
                for (String email : emailList) {
                    finalResults.put(email, null);
                }
            }
        }

        return Result.ok(finalResults);
    }
    private static String sendCommand(BufferedWriter writer, BufferedReader reader, String command) throws IOException {
        writer.write(command + "\r\n");
        writer.flush();//清空 BufferedWriter 缓冲区，确保命令立即发送到服务器
        logger.info("Sent: " + command);
        return readResponse(reader);
    }

    //用于从服务器读取响应数据的输入流
    private static String readResponse(BufferedReader reader) throws IOException {
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
            //只读取三位状态码开头的行
            if (line.charAt(3) == ' ') { // SMTP response ends with a line that has a space after the status code
                break;
            }
        }
        logger.info("Received: " + response.toString());
        return response.toString();
    }

    private static List<String> fetchMXRecords(String domain) throws Exception {
        List<String> mxRecords = new ArrayList<>();
        Hashtable<String, String> env = new Hashtable<>();
        // Use DnsContextFactory to perform DNS lookup
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.dns.DnsContextFactory");
        //使用默认的DNS服务器
        env.put(Context.PROVIDER_URL, "dns:");
        //使用上述环境变量 env 创建一个 InitialDirContext对象ictx
        DirContext ictx = new InitialDirContext(env);
        //调用 ictx.getAttributes() 方法来查询指定域名的 MX 记录
        Attributes attrs = ictx.getAttributes(domain, new String[]{"MX"});

        if (attrs != null && attrs.get("MX") != null) {
            for (int i = 0; i < attrs.get("MX").size(); i++) {
                String mxRecord = attrs.get("MX").get(i).toString();
                String[] parts = mxRecord.split(" ");
                //可能以.结尾，需要去掉末尾的点
                mxRecords.add(parts[1].endsWith(".") ? parts[1].substring(0, parts[1].length() - 1) : parts[1]);
            }
        }

        return mxRecords;
    }
}
