package com.cusob.controller;

import com.cusob.auth.AuthContext;
import com.cusob.dto.DomainDto;
import com.cusob.entity.Domain;
import com.cusob.result.Result;
import com.cusob.service.DomainService;
import com.cusob.vo.DomainListVo;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/domain")
public class DomainController {

    @Autowired
    private DomainService domainService;

    @ApiOperation("verify domain") //验证域名有效性
    @PostMapping("verify")
    public Result verify(String domain){
        Map<String, Boolean> map = domainService.domainVerify(domain);
        return Result.ok(map);
    }

    @ApiOperation("get DomainList")
    @GetMapping("getList")
    public Result getDomainList(){
        List<Domain> list = domainService.getDomainList();
        return Result.ok(list);
    }

    @ApiOperation("Save domain")
    @PostMapping("save")
    public Result saveDomain(@RequestBody DomainDto domainDto){
        Domain domain = new Domain();
        BeanUtils.copyProperties(domainDto,domain);
        domain.setUserId(AuthContext.getUserId());
        domainService.save(domain);
        return Result.ok();
    }

    @ApiOperation("remove Domain")
    @DeleteMapping("remove")
    public Result removeDomain(Long id){
        domainService.removeById(id);
        return Result.ok();
    }
}
