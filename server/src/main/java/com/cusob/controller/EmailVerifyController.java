package com.cusob.controller;

import com.cusob.result.Result;
import com.cusob.service.EmailVerifyService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RequestMapping("/emailVerify")
@RestController
public class EmailVerifyController {
    @Autowired
    private EmailVerifyService emailVerifyService;

    @ApiOperation("verify email")
    @PostMapping("verify")
    public Result<Map<String,Boolean>> verifyEmail(@RequestBody List<String> emails) {
        List<String> emailList = new ArrayList<>(emails);
        return emailVerifyService.verifyEmail(emailList);
    }

}
