package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.constant.MqConst;
import com.cusob.constant.RedisConst;
import com.cusob.dto.SenderDto;
import com.cusob.entity.Dkim;
import com.cusob.entity.Domain;
import com.cusob.entity.Email;
import com.cusob.entity.EmailSettings;
import com.cusob.entity.Sender;
import com.cusob.exception.CusobException;
import com.cusob.mapper.SenderMapper;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.DkimService;
import com.cusob.service.DomainService;
import com.cusob.service.MailService;
import com.cusob.service.EmailSettingsService;
import com.cusob.service.SenderService;

import com.cusob.utils.Ports;

import com.cusob.utils.ReadEmail;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import javax.mail.*;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class SenderServiceImpl extends ServiceImpl<SenderMapper, Sender> implements SenderService {

    @Autowired
    private RedisTemplate redisTemplate;

    @Resource
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private DomainService domainService;

    @Value("${cusob.domain.dkim.prefix}")
    private String dkimPrefix;

    @Value("${cusob.domain.smtp}")
    private String smtp;

    @Value("${cusob.domain.imap}")
    private String imap;

    @Value("${cusob.domain.dkim.selector}")
    private String selectorPrefix;

    @Autowired
    private DkimService dkimService;

    @Autowired
    private EmailSettingsService emailSettingsService;

    @Value("${cusob.url}")
    private String baseUrl;

    @Autowired
    private MailService mailService;



    /**
     * save Sender
     * @param senderDto
     */
    @Override
    public void saveSender(SenderDto senderDto) {
        // 参数校验
        if (!StringUtils.hasText(senderDto.getEmail())){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_EMPTY);
        }
        if (!StringUtils.hasText(senderDto.getPassword())){
            throw new CusobException(ResultCodeEnum.PASSWORD_IS_EMPTY);
        }
        String email = senderDto.getEmail();
        Sender senderSelect = baseMapper.selectOne(
                new LambdaQueryWrapper<Sender>()
                        .eq(Sender::getEmail, email)
        );

        if (senderSelect!=null ){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_BOUND);
        }
        Sender sender = new Sender();
        BeanUtils.copyProperties(senderDto, sender);
        String suffix = sender.getEmail().split("@")[1];
        EmailSettings settings = emailSettingsService.getSettings(suffix);
        if(settings == null && sender.getSmtpServer()==null){
            throw new CusobException(ResultCodeEnum.EMAIL_CATEGORY_NOEXIST);
        }
        else {
        if(sender.getServerType().equals("IMAP")){
            if(sender.getImapServer()==null){
                sender.setImapServer(settings.getImapServer());
            }
            if(sender.getImapPort()==null){
                if(sender.getImapEncryption()==null || sender.getImapEncryption().equals("SSL")){
                    sender.setImapPort(Ports.IMAP_SSL_PORT);
                }else {
                    sender.setImapPort(Ports.IMAP_NOEncryption_PORT);
                }
            }
        }else if(sender.getServerType().equals("POP3")){
            if (sender.getPopServer()==null){
                sender.setPopServer(settings.getPopServer());
            }
            if(sender.getPopPort()==null){
                if(sender.getPopEncryption()==null){
                    sender.setPopPort(Ports.POP_SSL_PORT);
                }else {
                    sender.setPopPort(Ports.POP_NOEncryption_PORT);
                }
            }
        }
        if(sender.getSmtpServer()==null){
            sender.setSmtpServer(settings.getSmtpServer());
        }

        if(sender.getSmtpPort()==null){
            if (sender.getSmtpEncryption().equals("NO")) {
                sender.setSmtpPort(Ports.SMTP_NOEncryption_PORT);
            } else if (sender.getSmtpEncryption().equals("STARTTLS")) {
                sender.setSmtpPort(Ports.SMTP_STARTTLS_PORT);
            } else {
                sender.setSmtpPort(Ports.SMTP_SSL_PORT);
            }
        }
        }
        final Properties props = new Properties();

        // 表示SMTP发送邮件，需要进行身份验证
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.host", sender.getSmtpServer());
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.socketFactory.port", sender.getSmtpPort());
        props.put("mail.smtp.port",sender.getSmtpPort());
        props.put("mail.smtp.from", email);
        props.put("mail.user", email);
        props.put("mail.password", sender.getPassword());
        props.setProperty("mail.smtp.ssl.enable", "true");

        // 构建授权信息，用于进行SMTP身份验证
        Authenticator authenticator = new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                // 用户名、密码
                String userName = props.getProperty("mail.user");
                String password = props.getProperty("mail.password");
                return new PasswordAuthentication(userName, password);
            }
        };
        Session session = Session.getInstance(props, authenticator);

        try {
            // 连接到SMTP服务器
            Transport transport = session.getTransport("smtp");
            transport.connect(sender.getSmtpServer(), sender.getSmtpPort(), email, sender.getPassword());
            transport.close();
        } catch (AuthenticationFailedException e) {
           throw new CusobException(ResultCodeEnum.PASSWORD_WRONG);
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        sender.setUserId(AuthContext.getUserId());
        baseMapper.insert(sender);
        String domain = email.substring(email.lastIndexOf('@') + 1);
        Domain domainSelect = domainService.getByDomain(domain);
        if (domainSelect == null){
            Domain domainSave = new Domain();
            domainSave.setDomain(domain);
            domainSave.setUserId(AuthContext.getUserId());
            domainService.save(domainSave);
            rabbitTemplate.convertAndSend(MqConst.EXCHANGE_DKIM_DIRECT,
                    MqConst.ROUTING_GENERATE_DKIM, domain);
        }
    }

    @Override
    public void saveDomainSender(String email,String password) {
        Sender senderSelect = baseMapper.selectOne(
                new LambdaQueryWrapper<Sender>()
                        .eq(Sender::getEmail, email)
        );
        if (senderSelect!=null ){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_BOUND);
        }
        Sender sender = new Sender();
        sender.setEmail(email);
        sender.setPassword(password);
        sender.setPopPort(Ports.POP_SSL_PORT);
        sender.setImapPort(Ports.IMAP_SSL_PORT);
        sender.setSmtpPort(Ports.SMTP_SSL_PORT);
        sender.setSmtpServer(smtp);
        sender.setImapServer(imap);
        sender.setUserId(AuthContext.getUserId());
        sender.setServerType("IMAP");
        sender.setImapEncryption("SSL");
        sender.setSmtpEncryption("SSL");
        baseMapper.insert(sender);
    }

    @Override
    public void checkEmail(String email) {
        String subject = "Welcome to Our Email Marketing Platform! Check your Email";
        String uuid = UUID.randomUUID().toString()+System.currentTimeMillis();
        redisTemplate.opsForValue().set(email,uuid);
        redisTemplate.opsForValue().set(uuid,email);
        //发送注册激活邮件格式的激活邮件
        String content = ReadEmail.readwithcode("emails/activate.html",baseUrl+"/domainCertify?uuid="+uuid);
        //将模板替换为特定内容
        mailService.sendHtmlMailMessage(email,subject,content);
    }

    @Override
    public String check(String uuid) {
        return redisTemplate.opsForValue().get(uuid).toString();
    }

    @Override
    public void createSender(String email, String password) {
        String urlString = "https://mail.email-marketing-hub.com/api/v1/user";
        HttpURLConnection connection = null;
        try {
            URL url = new URL(urlString);

            // 打开连接
            connection = (HttpURLConnection) url.openConnection();

            // 设置请求方法为 POST
            connection.setRequestMethod("POST");

            // 设置请求头
            connection.setRequestProperty("Content-Type", "application/json; utf-8");
            connection.setRequestProperty("Accept", "application/json");

            // 启用输出流
            connection.setDoOutput(true);

            // 创建请求体
            String jsonInputString = String.format("{\"email\": \"%s\", \"password\": \"%s\"}", email, password);

            // 写入请求体
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }
            int code = connection.getResponseCode();
            System.out.println("Response Code: " + code);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }


    }


    /**
     * get Sender By UserId
     */
    @Override
    public Sender getSenderByUserId() {
        Long userId = AuthContext.getUserId();
        Sender sender = baseMapper.selectOne(
                new LambdaQueryWrapper<Sender>().eq(Sender::getUserId, userId)
        );
        return sender;
    }

    /**
     * update Sender
     * @param senderDto
     */
    @Override
    public void updateSender(SenderDto senderDto) {
        // 参数校验
        if(!StringUtils.hasText(senderDto.getServerType())){
            throw new CusobException(ResultCodeEnum.SERVER_TYPE_IS_EMPTY);
        }
        if (!StringUtils.hasText(senderDto.getEmail())){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_EMPTY);
        }
        if (!StringUtils.hasText(senderDto.getPassword())){
            throw new CusobException(ResultCodeEnum.PASSWORD_IS_EMPTY);
        }
        Sender sender = new Sender();
        BeanUtils.copyProperties(senderDto, sender);
        sender.setUserId(AuthContext.getUserId());
        baseMapper.updateById(sender);
    }

    /**
     * remove Sender by userId
     */
    @Override
    public void removeSenderById(Long id) {
        baseMapper.deleteById(id);
    }

    /**
     * send verify code for binding sender
     * @param email
     */
    @Override
    public void sendCodeForSender(String email) {
        if (!StringUtils.hasText(email)){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_EMPTY);
        }
        String code = String.valueOf((int)((Math.random() * 9 + 1) * Math.pow(10,5)));
        String subject = "Cusob Team"; // todo 待优化
        String content = "Hi \n" +
                "You are now in the process of binding a email, and the verification code is as follows \n" +
                code;
        String key = RedisConst.BIND_EMAIL_PREFIX + email;
        // set verify code ttl 10 minutes
        redisTemplate.opsForValue().set(key, code, RedisConst.BIND_EMAIL_TIMEOUT, TimeUnit.MINUTES);
        Email mail = new Email();
        mail.setEmail(email);
        mail.setSubject(subject);
        mail.setContent(content);
        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_SENDER_DIRECT,
                MqConst.ROUTING_BIND_SENDER, mail);
    }

    /**
     * get Sender List
     * @return
     */
    @Override
    public List<Sender> getSenderList() {
        List<Sender> senderList = baseMapper.selectList(
                new LambdaQueryWrapper<Sender>()
                        .eq(Sender::getUserId, AuthContext.getUserId())
        );
        return senderList;
    }

    @Override
    public String selectByEmail(String email) {
        Sender sender = baseMapper.selectOne(new LambdaQueryWrapper<Sender>()
                .eq(Sender::getEmail, email)
                .eq(Sender::getUserId, AuthContext.getUserId())
        );
        if(sender == null){
            return null;
        }else {
            return Objects.requireNonNull(redisTemplate.opsForValue().get(email)).toString();//返回uuid
        }
    }


}
