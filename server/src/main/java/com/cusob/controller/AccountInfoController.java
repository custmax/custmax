package com.cusob.controller;

import com.cusob.auth.AuthContext;
import com.cusob.dto.AccountInfoDto;
import com.cusob.entity.AccountInfo;
import com.cusob.result.Result;
import com.cusob.service.AccountInfoService;
import com.cusob.service.BillingInfoService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/accountInfo")
public class AccountInfoController {

    @Autowired
    private AccountInfoService accountInfoService;

    @ApiOperation("save Account Information")
    @PostMapping("save")
    public Result saveAccountInfo(@RequestBody AccountInfoDto accountInfoDto){
        accountInfoService.saveAccountInfo(accountInfoDto);
        return Result.ok();
    }

    @ApiOperation("get account information")
    @GetMapping("get")
    public Result getAccountInfo(){
        AccountInfo accountInfo = accountInfoService.getAccountInfo();
        return Result.ok(accountInfo);
    }

    @ApiOperation("check if address is existed")
    @GetMapping("getAddress")
    public Result getAddr(){
        Long userId = AuthContext.getUserId();
        String addr = accountInfoService.getAddr(userId);
        if(addr == null){
            return Result.ok(false);
        }
        return Result.ok(true);
    }

    @ApiOperation("update account information")
    @PostMapping("update")
    public Result updateAccountInfo(@RequestBody AccountInfoDto accountInfoDto){
        accountInfoService.updateAccountInfo(accountInfoDto);
        return Result.ok();
    }
}
