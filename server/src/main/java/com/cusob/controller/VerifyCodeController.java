package com.cusob.controller;

import com.cusob.exception.CusobException;
import com.cusob.result.Result;
import com.cusob.result.ResultCodeEnum;
import com.cusob.utils.VerifyCodeUtil;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/captcha")
public class VerifyCodeController {

    @ApiOperation("get Captcha")
    @GetMapping("getCaptcha")
    public Result getCaptcha(){
        Map<String, String> map = VerifyCodeUtil.generateCaptcha();
        return Result.ok(map);
    }

}
