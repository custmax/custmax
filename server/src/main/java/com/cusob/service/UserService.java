package com.cusob.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.dto.ForgetPasswordDto;
import com.cusob.dto.UpdatePasswordDto;
import com.cusob.dto.UserDto;
import com.cusob.dto.UserLoginDto;
import com.cusob.entity.User;
import com.cusob.vo.UserLoginVo;
import com.cusob.vo.UserVo;

public interface UserService extends IService<User> {

    /**
     * add User(User Register)
     * @param userDto
     */
    void addUser(UserDto userDto);

    /**
     * get UserInfo by id
     * @return
     */
    UserVo getUserInfo();

    /**
     * update UserInfo
     * @param userVo
     */
    void updateUserInfo(UserVo userVo);


    /**
     * get UserList
     * @param pageParam
     * @return
     */
    IPage<User> getUserList(Page<User> pageParam);

    /**
     * user login
     * @param userLoginDto
     * @return
     */
    UserLoginVo login(UserLoginDto userLoginDto);

    /**
     * update password
     * @param updatePasswordDto
     */
    void updatePassword(UpdatePasswordDto updatePasswordDto);

    /**
     * send verify code for updating password
     */
    void sendCodeForPassword(String email);

    /**
     * get User By Email
     * @param email
     * @return
     */
    User getUserByEmail(String email);

    /**
     * send Email For Register Success
     */
    void sendEmailForRegisterSuccess(String userId,String email);

    boolean checkUuid(String uuid);

    /**
     * send Verify Code for signing up
     */
    void sendVerifyCode(String email);


    /**
     * forget password
     * @param forgetPasswordDto
     */
    void forgetPassword(ForgetPasswordDto forgetPasswordDto);

    /**
     * Invite colleagues to join
     * @param email
     */
    void invite(String email);



    /**
     * Register For Invited
     * @param userDto
     */
    void registerForInvited(UserDto userDto, String encode);

    /**
     * add Admin
     * @param userId
     */
    void addAdmin(Long userId);

    /**
     * remove Admin
     * @param userId
     */
    void removeAdmin(Long userId);

    /**
     * remove User
     * @param userId
     */
    void removeUser(Long userId);

    /**
     * send email for reset
     * @param email
     */
    void sendEmailForResetPassword(String email);
}
