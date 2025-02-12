package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.constant.MqConst;
import com.cusob.constant.RedisConst;
import com.cusob.dto.ForgetPasswordDto;
import com.cusob.dto.UpdatePasswordDto;
import com.cusob.dto.UserDto;
import com.cusob.dto.UserLoginDto;
import com.cusob.entity.*;
import com.cusob.exception.CusobException;
import com.cusob.mapper.UserMapper;
import com.cusob.properties.JwtProperties;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.CompanyService;
import com.cusob.service.MailService;
import com.cusob.service.PlanPriceService;
import com.cusob.service.UserService;
import com.cusob.utils.JwtUtil;
import com.cusob.utils.ReadEmail;
import com.cusob.vo.UserLoginVo;
import com.cusob.vo.UserVo;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;


@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Value("${cusob.cf-secret-key}")
    private String turnstileSecretKey ;

    @Autowired
    private JwtProperties jwtProperties;

    @Autowired
    private MailService mailService;


    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private PlanPriceService planPriceService;

    @Value("${cusob.url}")
    private String baseUrl;

    @Resource
    private RabbitTemplate rabbitTemplate;

    private final RestTemplate restTemplate;

    public UserServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * add User(User Register)
     * @param userDto
     */
    @Transactional
    @Override
    public void addUser(UserDto userDto) {
        this.paramEmptyVerify(userDto);//参数校验：检查邮箱和手机是否为空
        boolean flag = Pattern.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", userDto.getEmail());
        if (!flag){
            throw new CusobException(ResultCodeEnum.EMAIL_FORMAT_ERROR);//邮箱格式错误
        }
        this.registerVerify(userDto);//检查是否通过cf验证及邮箱是否已经注册

        User user = new User();
        BeanUtils.copyProperties(userDto, user);
        String password = userDto.getPassword();
        user.setCompanyId(0L); // default companyId=0
        // Password encryption
        user.setPassword(DigestUtils.md5DigestAsHex(password.getBytes()));
        user.setPermission(User.USER);
        user.setIsAvailable(User.DISABLE);//默认不可用
        baseMapper.insert(user);

        Company company = new Company();
        company.setCompanyName(userDto.getCompany());
        company.setAdminId(user.getId());
        company.setPlanId(PlanPrice.FREE); // default free plan
        companyService.saveCompany(company);

        user.setCompanyId(company.getId());
        baseMapper.updateById(user);

        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();//将用户信息存入redis
        String uuid = UUID.randomUUID().toString()+System.currentTimeMillis();//生成uuid
        hashOperations.put(uuid,"email",user.getEmail());//将用户信息存入redis
        hashOperations.put(uuid,"password",user.getPassword());
        hashOperations.put(uuid,"phone",user.getPhone());
        redisTemplate.expire(uuid, 30, TimeUnit.MINUTES);

        Map<String,String> usermap = new HashMap<>();
        usermap.put("uuid",uuid);
        usermap.put("email",user.getEmail());
        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_REGISTER_DIRECT,
                MqConst.ROUTING_REGISTER_SUCCESS, usermap); //发送注册邮件
    }

    private void registerVerify(UserDto userDto) {
        String turnstileToken = userDto.getTurnstileToken();
        if (!StringUtils.hasText(turnstileToken)){
            throw new CusobException(ResultCodeEnum.VERIFY_CODE_EMPTY);
        }

        String url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"; //验证CF是否通过了验证
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("secret", turnstileSecretKey);
        requestBody.put("response", turnstileToken);

        Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);//发送请求
        if (!(response != null && Boolean.TRUE.equals(response.get("success")))) {//验证失败
            throw new CusobException(ResultCodeEnum.VERIFY_CODE_WRONG);
        }

        String email = userDto.getEmail();
        User userDb = this.getUserByEmail(email);
        if (userDb != null){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_REGISTERED);
        }

    }

    private void paramEmptyVerify(UserDto userDto) {
        if (!StringUtils.hasText(userDto.getEmail())){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_EMPTY);
        }
        if(!StringUtils.hasText(userDto.getPhone())){
            throw new CusobException(ResultCodeEnum.PHONE_IS_EMPTY);
        }
        //todo 链接激活

    }

    /**
     * Register For Invited
     * @param userDto
     */
    @Override
    public void registerForInvited(UserDto userDto, String encode) {
        this.paramEmptyVerify(userDto);
        this.registerVerify(userDto);
        byte[] decode = Base64.getDecoder().decode(URLDecoder.decode(encode));
        String emailInviter = new String(decode);
        String key = RedisConst.INVITE_PREFIX + emailInviter;
        Set<String> members = redisTemplate.opsForSet().members(key);
        if (members==null){
            throw new CusobException(ResultCodeEnum.INVITE_LINK_INVALID);
        }
        if (!members.contains(userDto.getEmail())){
            throw new CusobException(ResultCodeEnum.EMAIL_NOT_INVITED);
        }

        User user = new User();
        BeanUtils.copyProperties(userDto, user);
        String password = userDto.getPassword();
        // Password encryption
        user.setPassword(DigestUtils.md5DigestAsHex(password.getBytes()));
        User inviter = this.getUserByEmail(emailInviter);
        user.setCompanyId(inviter.getCompanyId());
        user.setPermission(User.USER);
        user.setIsAvailable(User.DISABLE);  // todo default disable
        baseMapper.insert(user);
    }

    /**
     * add Admin
     * @param userId
     */
    @Override
    public void addAdmin(Long userId) {
        User user = baseMapper.selectById(userId);
        Integer permission = user.getPermission();
        if (!permission.equals(User.USER)){
            throw new CusobException(ResultCodeEnum.USER_IS_ADMIN);
        }
        user.setPermission(User.ADMIN);
        baseMapper.updateById(user);
    }

    /**
     * remove Admin
     * @param userId
     */
    @Override
    public void removeAdmin(Long userId) {
        Long id = AuthContext.getUserId();
        User user = baseMapper.selectById(id);
        Company company = companyService.getById(user.getCompanyId());
        // Only Super Admin can remove admin
        if (!company.getAdminId().equals(id)){
            throw new CusobException(ResultCodeEnum.NO_OPERATION_PERMISSIONS);
        }
        User toRemove = baseMapper.selectById(userId);
        if (!toRemove.getPermission().equals(User.ADMIN)){
            throw new CusobException(ResultCodeEnum.REMOVE_ADMIN_FAIL);
        }
        toRemove.setPermission(User.USER);
        baseMapper.updateById(toRemove);
    }

    /**
     * remove User
     * @param userId
     */
    @Override
    public void removeUser(Long userId) {

        Long adminId = AuthContext.getUserId();
        User admin = baseMapper.selectById(adminId);
        Integer permission = admin.getPermission();
        User toRemove = baseMapper.selectById(userId);
        Integer toRemovePermission = toRemove.getPermission();
        // Normal user can't remove others
        if (permission<=toRemovePermission){
            throw new CusobException(ResultCodeEnum.NO_OPERATION_PERMISSIONS);
        }
        baseMapper.deleteById(userId);
    }

    /**
     * get UserInfo by id
     * @return
     */
    @Override
    public UserVo getUserInfo() {
        Long userId = AuthContext.getUserId();
        User user = baseMapper.selectById(userId);
        UserVo userVo = new UserVo();
        BeanUtils.copyProperties(user, userVo);
        return userVo;
    }



    /**
     * update UserInfo
     * @param userVo
     */
    @Override
    public void updateUserInfo(UserVo userVo) {
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(userVo, userDto);
        this.paramEmptyVerify(userDto);
        User user = new User();
        BeanUtils.copyProperties(userVo, user);
        baseMapper.updateById(user);
    }

    /**
     * get UserList
     * @param pageParam
     * @return
     */
    @Override
    public IPage<User> getUserList(Page<User> pageParam) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        Long userId = AuthContext.getUserId();
        User user = baseMapper.selectById(userId);
        wrapper.eq(User::getCompanyId, user.getCompanyId());
        IPage<User> page = baseMapper.selectPage(pageParam, wrapper);
        return page;
    }

    /**
     * user login
     * @param userLoginDto
     * @return
     */
    @Override
    public UserLoginVo login(UserLoginDto userLoginDto) {
        String email = userLoginDto.getEmail();
        String password = userLoginDto.getPassword();
        // select user from table email
        User user = baseMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getEmail, email)
        );
        // Email is not registered
        if (user==null){
            throw new CusobException(ResultCodeEnum.EMAIL_NOT_EXIST);
        }
        // Password is wrong
        String psd = DigestUtils.md5DigestAsHex(password.getBytes());
        if (!psd.equals(user.getPassword())){
            throw new CusobException(ResultCodeEnum.PASSWORD_WRONG);
        }
        // todo User is Disable(During the internal test, you cannot log in temporarily)
        if (user.getIsAvailable().equals(User.DISABLE)){
            HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
            String uuid = UUID.randomUUID().toString()+System.currentTimeMillis();
            hashOperations.put(uuid,"email",user.getEmail());
            hashOperations.put(uuid,"password",user.getPassword());
            hashOperations.put(uuid,"phone",user.getPhone());
            redisTemplate.expire(uuid, 30, TimeUnit.MINUTES);

            Map<String,String> usermap = new HashMap<>();
            usermap.put("uuid",uuid);
            usermap.put("email",user.getEmail());
            rabbitTemplate.convertAndSend(MqConst.EXCHANGE_REGISTER_DIRECT,
                    MqConst.ROUTING_REGISTER_SUCCESS, usermap); //发送注册邮件
            throw new CusobException(ResultCodeEnum.USER_IS_DISABLE);
        }

        // Generate token
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("companyId", user.getCompanyId());
        String token = JwtUtil.createJWT(jwtProperties.getSecretKey(), jwtProperties.getTtl(), claims);

        UserLoginVo userLoginVo = UserLoginVo.builder()
                .id(user.getId())
                .lastName(user.getLastName())
                .firstName(user.getFirstName())
                .avatar(user.getAvatar())
                .token(token)
                .build();
        return userLoginVo;
    }

    /**
     * update password
     * @param updatePasswordDto
     */
    @Override
    public void updatePassword(UpdatePasswordDto updatePasswordDto) {
        String oldPassword = updatePasswordDto.getOldPassword();
        // old password is empty
        if (!StringUtils.hasText(oldPassword)){
            throw new CusobException(ResultCodeEnum.OLD_PASSWORD_EMPTY);
        }
        String oldPsd = DigestUtils.md5DigestAsHex(oldPassword.getBytes());
        Long userId = AuthContext.getUserId();
        User user = baseMapper.selectById(userId);
        // old password is wrong
        if (!oldPsd.equals(user.getPassword())){
            throw new CusobException(ResultCodeEnum.OLD_PASSWORD_WRONG);
        }
        String newPassword = updatePasswordDto.getNewPassword();
        String newPsd = DigestUtils.md5DigestAsHex(newPassword.getBytes());
        user.setPassword(newPsd);
        baseMapper.updateById(user);
    }

    /**
     * send verify code for updating password
     */
    @Override
    public void sendCodeForPassword(String email) {
        User user = this.getUserByEmail(email);
        if (user==null){
            throw new CusobException(ResultCodeEnum.EMAIL_NOT_EXIST);
        }
        String code = String.valueOf((int)((Math.random() * 9 + 1) * Math.pow(10,5)));
        String subject = "Password Reset Instructions for Your Email Marketing Platform Account";
        // todo 待优化
        String content = ReadEmail.readwithcode("emails/email-forgetpassword.html",code);

        String key = RedisConst.PASSWORD_PREFIX + email;
        redisTemplate.opsForValue().set(key, code, RedisConst.PASSWORD_TIMEOUT, TimeUnit.MINUTES);
        Email mail = new Email();
        mail.setEmail(email);
        mail.setSubject(subject);
        mail.setContent(content);
        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_PASSWORD_DIRECT, MqConst.ROUTING_FORGET_PASSWORD, mail);
    }

    /**
     * send email for reset password
     */
    @Override
    public void sendEmailForResetPassword(String email) {
        // 获取用户信息
        User user = this.getUserByEmail(email);
        if (user == null) {
            throw new CusobException(ResultCodeEnum.EMAIL_NOT_EXIST);
        }

        // 加密邮箱
        String emailKey = DigestUtils.md5DigestAsHex(email.getBytes());

        // 生成链接
        String link = baseUrl+"/resetPassword?email=" +emailKey;
        String subject = "Password Reset Instructions for Your Email Marketing Platform Account";
        String content = ReadEmail.readwithcode("emails/reset.html", link);
        content = content.replace("{EMAIL_PLACEHOLDER}", email);

        // 将加密邮箱作为键，原始邮箱和验证码作为值存储在Redis中
        String redisKey = RedisConst.PASSWORD_PREFIX + emailKey;
        redisTemplate.opsForValue().set(redisKey, email , RedisConst.PASSWORD_TIMEOUT, TimeUnit.MINUTES);

        // 准备邮件对象
        Email mail = new Email();
        mail.setEmail(email);
        mail.setSubject(subject);
        mail.setContent(content);

        // 发送邮件
        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_PASSWORD_DIRECT, MqConst.ROUTING_FORGET_PASSWORD, mail);
    }


    /**
     * get User By Email
     * @param email
     * @return
     */
    @Override
    public User getUserByEmail(String email) {
        User user = baseMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getEmail, email)
        );
        return user;
    }

    /**
     * send Email For Register Success
     */
    @Override
    public void sendEmailForRegisterSuccess(String uuid,String email) {

        String subject = "Welcome to Our Email Marketing Platform! New User Guide";
        // todo 待优化
        String content = ReadEmail.readwithcode("emails/activate.html",baseUrl+"/registerSuccess?uuid="+uuid);
        mailService.sendHtmlMailMessage(email, subject, content);
    }

    @Override
    public boolean checkUuid(String uuid) {
        if(uuid == null){
            return false;
        }
        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
        Map<String, String> entries = hashOperations.entries(uuid);
        if(!entries.isEmpty()){

            String email = entries.get("email");

            User user = baseMapper.selectOne(
                    new LambdaQueryWrapper<User>()
                            .eq(User::getEmail, email)
            );
            if(user.getIsAvailable() == 0){
                user.setIsAvailable(User.AVAILABLE); // TODO 开启使用//如果已经存在该账号就不要再插入
                baseMapper.updateById(user);
            }

            return true;
        }
        return false;
    }

    /**
     * send Verify Code for signing up
     */
    @Override
    public void sendVerifyCode(String email) {
        if (!StringUtils.hasText(email)){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_EMPTY);
        }
        String code = String.valueOf((int)((Math.random() * 9 + 1) * Math.pow(10,5)));

        String subject = "Welcome to Our Email Marketing Platform! Verification Code Reminder";
        String content = ReadEmail.readwithcode("emails/email-signup.html",code);
        // todo 待优化
        Email mail = new Email();
        mail.setEmail(email);
        mail.setSubject(subject);
        mail.setContent(content);
        String key = RedisConst.REGISTER_PREFIX + email;
        // set verify code ttl 10 minutes
        redisTemplate.opsForValue().set(key, code, RedisConst.REGISTER_TIMEOUT, TimeUnit.MINUTES);
        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_SIGN_DIRECT, MqConst.ROUTING_SEND_CODE, mail);
    }

    /**
     * forget password
     * @param forgetPasswordDto
     */
    @Override
    public void forgetPassword(ForgetPasswordDto forgetPasswordDto) {
        String encryptedEmail = forgetPasswordDto.getEmail(); // 这个是加密后的邮箱
        if (!StringUtils.hasText(encryptedEmail)) {
            throw new CusobException(ResultCodeEnum.EMAIL_IS_EMPTY);
        }

        String password = forgetPasswordDto.getPassword();
        if (!StringUtils.hasText(password)) {
            throw new CusobException(ResultCodeEnum.PASSWORD_IS_EMPTY);
        }

        // Redis中根据加密后的邮箱查找存储的原始邮箱
        String redisKey = RedisConst.PASSWORD_PREFIX + encryptedEmail;
        String originalEmail = (String) redisTemplate.opsForValue().get(redisKey);
        if (originalEmail == null) {
            throw new CusobException(ResultCodeEnum.VERIFY_CODE_WRONG); // 错误码可以调整为更合适的
        }

        // 获取用户并更新密码
        User user = this.getUserByEmail(originalEmail);
        if (user == null) {
            throw new CusobException(ResultCodeEnum.EMAIL_NOT_EXIST);
        }

        user.setPassword(DigestUtils.md5DigestAsHex(password.getBytes()));
        baseMapper.updateById(user);
    }


    /**
     * Invite colleagues to join
     * @param email
     */
    @Override
    public void invite(String email) {
        Company company = companyService.getById(AuthContext.getCompanyId());
        // Free user
        if (company.getPlanId().equals(PlanPrice.FREE)){
            throw new CusobException(ResultCodeEnum.NO_PERMISSION);
        }

        Integer count = this.getUserCount();
        PlanPrice plan = planPriceService.getPlanById(company.getPlanId());
        String planName = plan.getName();

        Long userId = AuthContext.getUserId();
        User inviter = baseMapper.selectById(userId);
        String key = RedisConst.INVITE_PREFIX + inviter.getEmail();

        int num = 0;
        Long size = redisTemplate.opsForSet().size(key);
        if (size!=null){
            num += size.intValue();
        }
        // Essentials user
        if (planName.equals(PlanPrice.ESSENTIALS)){
            if (count + num >=PlanPrice.ESSENTIALS_USER_LIMIT){
                throw new CusobException(ResultCodeEnum.USER_NUMBER_FULL);
            }
        }
        // Standard user
        if (planName.equals(PlanPrice.STANDARD)){
            if (count + num >=PlanPrice.STANDARD_USER_LIMIT){
                throw new CusobException(ResultCodeEnum.USER_NUMBER_FULL);
            }
        }

        if (!StringUtils.hasText(email)){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_EMPTY);
        }
        User user = this.getUserByEmail(email);
        if (user!=null){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_REGISTERED);
        }

        String subject = inviter.getFirstName() + " " + inviter.getLastName() + " is inviting you to join the " +
                inviter.getCompany(); // todo 待优化
        String encode = Base64.getEncoder().encodeToString(inviter.getEmail().getBytes());
        String content = "Hi,\n" +
                subject +
                inviter.getCompany() + ".\n" +
                "Click the link below to join: \n" +
                baseUrl + "/signupByInvite?verifyCode=" + URLEncoder.encode(encode)
                ;
        redisTemplate.opsForSet().add(key, email);
        redisTemplate.expire(key, RedisConst.INVITE_TIMEOUT, TimeUnit.MINUTES);

        Email mail = new Email();
        mail.setEmail(email);
        mail.setSubject(subject);
        mail.setContent(content);
        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_INVITE_DIRECT,
                MqConst.EXCHANGE_INVITE_DIRECT,
                mail
        );
    }

    /**
     * get User Count
     */
    private Integer getUserCount() {
        Long companyId = AuthContext.getCompanyId();
        Integer count = baseMapper.selectCount(
                new LambdaQueryWrapper<User>()
                        .eq(User::getCompanyId, companyId)
        );
        return count;
    }


}
