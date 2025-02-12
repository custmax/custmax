package com.cusob.controller;

import com.cusob.auth.AuthContext;
import com.cusob.dto.ApiDomainDto;
import com.cusob.entity.ApiDomain;
import com.cusob.exception.CusobException;
import com.cusob.result.Result;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.ApiDomainService;
import com.cusob.service.UserService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/apiDomain")
@RestController
public class ApiDomainController {
    @Autowired
    private ApiDomainService apiDomainService;


    @ApiOperation("save Domain")
    @PostMapping("save")
    public Result saveDomain(@RequestBody ApiDomainDto apiDomainDto){
        apiDomainService.saveDomain(apiDomainDto);
        return Result.ok();
    }


}
