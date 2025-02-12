package com.cusob.controller;

import com.cusob.dto.BillingInfoDto;
import com.cusob.entity.BillingInfo;
import com.cusob.result.Result;
import com.cusob.service.BillingInfoService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/billingInfo")
public class BillingInfoController {

    @Autowired
    private BillingInfoService billingInfoService;

    @ApiOperation("save billing Information")
    @PostMapping("save")
    public Result saveBillingInfo(@RequestBody BillingInfoDto billingInfoDto){
        billingInfoService.saveBillingInfo(billingInfoDto);
        return Result.ok();
    }

    @ApiOperation("get Billing Information")
    @GetMapping("get")
    public Result getBillingInfo(){
        BillingInfo billingInfo = billingInfoService.getBillingInfo();
        return Result.ok(billingInfo);
    }

    @ApiOperation("update billing Information")
    @PostMapping("update")
    public Result updateBillingInfo(@RequestBody BillingInfoDto billingInfoDto){
        billingInfoService.updateBillingInfo(billingInfoDto);
        return Result.ok();
    }
}
