package com.cusob.controller;

import com.cusob.dto.DkimDto;
import com.cusob.entity.Dkim;
import com.cusob.result.Result;
import com.cusob.service.DkimService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dkim")
public class DkimController {

    @Autowired
    private DkimService dkimService;

//    @ApiOperation("get publicKey by domain")
//    @GetMapping("getPublicKey")
//    public Result getPublicKey(String domain){ //未使用
//        String publicKey = dkimService.getPublicKey(domain);
//        return Result.ok(publicKey);
//    }

//    @ApiOperation("get Dkim by domain") //未使用
//    @GetMapping("get")
//    public Result getDkim(String domain){
//        Dkim dkim = dkimService.getDkim(domain);
//        return Result.ok(dkim);
//    }

    @ApiOperation("Save Dkim")
    @PostMapping("save")
    public Result saveDkim(@RequestBody DkimDto dkimDto){ //将获取到的DKim记录保存到数据库
        Dkim dkim = new Dkim();
        BeanUtils.copyProperties(dkimDto,dkim);
        dkimService.save(dkim);
        return Result.ok();
    }

}
