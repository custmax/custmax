package com.cusob.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cusob.auth.AuthContext;
import com.cusob.dto.ForgetPasswordDto;
import com.cusob.dto.UpdatePasswordDto;
import com.cusob.dto.UserDto;
import com.cusob.dto.UserLoginDto;
import com.cusob.entity.Minio;
import com.cusob.entity.User;
import com.cusob.result.Result;
import com.cusob.service.MinioService;
import com.cusob.service.UserService;
import com.cusob.vo.UserLoginVo;
import com.cusob.vo.UserVo;
import io.swagger.annotations.ApiOperation;
import org.simpleframework.xml.Path;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;


@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private Minio minio;

    @Autowired
    private MinioService minioService;

    @Autowired
    private UserService userService;

//    @ApiOperation("add User(User Register)")
//    @GetMapping("get")
//    public Result getUser(){
//        Long userId = AuthContext.getUserId();
//
//        return Result.ok(userId);
//    }
    @ApiOperation("add User(User Register)")
    @PostMapping("register")
    public Result addUser(@RequestBody UserDto userDto){
        userService.addUser(userDto);
        return Result.ok();
    }

    @ApiOperation("add User(User Register)")
    @GetMapping("checkUuid/{uuid}")
    public Result checkUuid(@PathVariable String uuid){
        boolean status = userService.checkUuid(uuid);
        if(status){
            return Result.ok();
        }
        return Result.fail("Link timed out");
    }

    @ApiOperation("Invite colleagues to join")
    @PostMapping("invite")
    public Result invite(String email){
        userService.invite(email);
        return Result.ok();
    }

    @ApiOperation("Register For Invited")
    @PostMapping("registerForInvited")
    public Result RegisterForInvited(@RequestBody UserDto userDto, String encode){
        userService.registerForInvited(userDto, encode);
        return Result.ok();
    }

    @ApiOperation("get UserInfo by id")
    @GetMapping("getUserInfo")
    public Result getUserInfo(){
        UserVo userVo = userService.getUserInfo();
        return Result.ok(userVo);
    }

    @ApiOperation("update UserInfo")
    @PutMapping("update")
    public Result updateUserInfo(@RequestBody UserVo userVo){
        userService.updateUserInfo(userVo);
        return Result.ok();
    }

    @ApiOperation("get UserList")
    @GetMapping("getUserList/{page}/{limit}")
    public Result getUserList(@PathVariable Long page,
                                       @PathVariable Long limit){
        Page<User> pageParam = new Page<>(page, limit);
        IPage<User> pageModel = userService.getUserList(pageParam);
        return Result.ok(pageModel);
    }

    @ApiOperation("update Password")
    @PostMapping("updatePassword")
    public Result updatePassword(@RequestBody UpdatePasswordDto updatePasswordDto){
        userService.updatePassword(updatePasswordDto);
        return Result.ok();
    }

    /**
     * user login
     * @param userLoginDto
     * @return
     */
    @PostMapping("login")
    @ApiOperation(value = "user login")
    public Result login(@RequestBody UserLoginDto userLoginDto) {
        UserLoginVo userLoginVo = userService.login(userLoginDto);
        return Result.ok(userLoginVo);
    }

    @ApiOperation("upload Avatar")
    @PostMapping("uploadAvatar")
    public Result uploadAvatar(@RequestPart("file") MultipartFile file){
        String url = minioService.uploadAvatar(minio.getBucketName(), file);
        return Result.ok(url);
    }

    @ApiOperation("send verify code for updating password")
    @PostMapping("sendCodeForPassword")
    public Result sendCodeForPassword(String email){
        userService.sendCodeForPassword(email);
        return Result.ok();
    }

    @ApiOperation("send email for reset password")
    @PostMapping("sendEmailForResetPassword")
    public Result sendEmailForPassword(String email){
        userService.sendEmailForResetPassword(email);
        return Result.ok();
    }

    @ApiOperation("forget password")
    @PostMapping("forgetPassword")
    public Result forgetPassword(@RequestParam Map<String, String> params){
        ForgetPasswordDto forgetPasswordDto = new ForgetPasswordDto();
        forgetPasswordDto.setEmail(params.get("email"));
        forgetPasswordDto.setPassword(params.get("password"));

        userService.forgetPassword(forgetPasswordDto);
        return Result.ok();
    }
    @ApiOperation("send verify code for signing up")
    @PostMapping("sendVerifyCode")
    public Result sendVerifyCode(String email){
        userService.sendVerifyCode(email);
        return Result.ok();
    }


    @ApiOperation("add Admin")
    @PostMapping("addAdmin")
    public Result addAdmin(Long userId){
        userService.addAdmin(userId);
        return Result.ok();
    }

    @ApiOperation("remove Admin")
    @PostMapping("removeAdmin")
    public Result removeAdmin(Long userId){
        userService.removeAdmin(userId);
        return Result.ok();
    }

    @ApiOperation("remove User")
    @PostMapping("removeUser")
    public Result removeUser(Long userId){
        userService.removeUser(userId);
        return Result.ok();
    }
}
