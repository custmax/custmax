package com.cusob.controller;

import com.cusob.result.Result;
import com.cusob.service.CompanyService;
import com.cusob.vo.PlanDetailVo;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/company")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @ApiOperation("get Plan Detail")
    @GetMapping("getPlanDetail")
    public Result getPlanDetail(){
        PlanDetailVo planDetail = companyService.getPlanDetail();
        return Result.ok(planDetail);
    }
}
