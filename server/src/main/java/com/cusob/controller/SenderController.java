package com.cusob.controller;

import com.cusob.dto.DomainSenderDto;
import com.cusob.dto.SenderDto;
import com.cusob.entity.Sender;
import com.cusob.result.Result;
import com.cusob.service.SenderService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sender")
public class SenderController {

    @Autowired
    private SenderService senderService;

    @ApiOperation("save Sender")
    @PostMapping("save")
    public Result saveSender(@RequestBody SenderDto senderDto){
        senderService.saveSender(senderDto);
        return Result.ok();
    }

    @ApiOperation("save Sender by domainverify")
    @PostMapping("savedomainsender")
    public Result saveDomainSender(@RequestBody DomainSenderDto domainSenderDto){
        senderService.saveDomainSender(domainSenderDto.getEmail(),domainSenderDto.getPassword());
        return Result.ok();
    }

    @ApiOperation("check if the email is public")
    @GetMapping("checkEmail/{email}")
    public Result checkEmail(@PathVariable String email){
        String uuid = senderService.selectByEmail(email);
        if(StringUtils.hasText(uuid)){//如果uuid不为空，说明该email已经被绑定
            return Result.ok(uuid);
        }
        senderService.checkEmail(email);
        return Result.ok();
    }

    @ApiOperation("check if the uuid is existed")
    @GetMapping("check/{uuid}")
    public Result check(@PathVariable String uuid){ //获取uuid所对应的email
        String email = senderService.check(uuid);
        return Result.ok(email);
    }


    @ApiOperation("update Sender")
    @PostMapping("update")
    public Result updateSender(@RequestBody SenderDto senderDto){
        senderService.updateSender(senderDto);
        return Result.ok();
    }

    @ApiOperation("remove Sender")
    @DeleteMapping("remove")
    public Result removeSender(Long id){
        senderService.removeSenderById(id);
        return Result.ok();
    }

    @ApiOperation("send verify code for binding sender")
    @PostMapping("sendCodeForSender")
    public Result sendCodeForSender(String email){
        senderService.sendCodeForSender(email);
        return Result.ok();
    }

    @ApiOperation("get Sender List")
    @GetMapping("getList")
    public Result getSenderList(){
        List<Sender> senderList = senderService.getSenderList();
        return Result.ok(senderList);
    }
}
