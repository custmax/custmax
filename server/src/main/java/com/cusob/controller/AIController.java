package com.cusob.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cusob.dto.CampaignDto;
import com.cusob.dto.CampaignQueryDto;
import com.cusob.dto.PromptDto;
import com.cusob.entity.Campaign;
import com.cusob.entity.Contact;
import com.cusob.result.Result;
import com.cusob.service.AIService;
import com.cusob.service.CampaignService;
import com.cusob.vo.CampaignListVo;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/generate")
public class AIController {

    @Autowired
    private AIService aiService;

    @ApiOperation("generate by group and description")
    @PostMapping("generateByGroup")
    public Result generateByGroup(@RequestBody PromptDto promptDto){
        //aiService.generateByGroup(promptDto);
        //campaignService.saveCampaign(campaignDto, Campaign.DRAFT);
        return Result.ok(aiService.generateByGroup(promptDto));
    }
//    @ApiOperation("save Campaign Draft")
//    @PostMapping("saveDraft")
//    public Result saveDraft(@RequestBody CampaignDto campaignDto){
//        campaignService.saveCampaign(campaignDto, Campaign.DRAFT);
//        return Result.ok();
//    }
//
//    @ApiOperation("get Campaign By Id")
//    @GetMapping("get/{id}")
//    public Result getCampaignById(@PathVariable Long id){
//        Campaign campaign = campaignService.getCampaignById(id);
//        return Result.ok(campaign);
//    }
//
//    @ApiOperation("update Campaign")
//    @PostMapping("update")
//    public Result updateCampaign(@RequestBody CampaignDto campaignDto){
//        campaignService.updateCampaign(campaignDto);
//        return Result.ok();
//    }
//
//    @ApiOperation("get Campaign Page")
//    @GetMapping("getPage/{limit}/{page}")
//    public Result getCampaignPage(@PathVariable Long limit,
//                                  @PathVariable Long page,
//                                  CampaignQueryDto campaignQueryDto){
//        Page<Campaign> pageParam = new Page<>(page, limit);
//        IPage<CampaignListVo> pageVo = campaignService.getCampaignPage(pageParam, campaignQueryDto);
//        return Result.ok(pageVo);
//    }
//
//    @ApiOperation("send Email")
//    @PostMapping("sendEmail")
//    public Result sendEmail(@RequestBody CampaignDto campaignDto){
//        campaignService.sendEmail(campaignDto);
//        return Result.ok();
//    }
//
//    @ApiOperation("Email list")
//    @GetMapping("emailList/{groupId}")
//    public Result EmailList(@PathVariable long groupId){
//        List<Contact> sendList = campaignService.getSendList(groupId);
//        return Result.ok(sendList);
//    }
//
//    @ApiOperation("Get SenderName")
//    @GetMapping("getSenderName/{campaignName}")
//    public Result EmailList(@PathVariable String campaignName){
//        return Result.ok(campaignService.getCampaignByname(campaignName).getSenderName());
//    }
//
//    @ApiOperation("remove Campaign")
//    @DeleteMapping("remove/{id}")
//    public Result removeCampaign(@PathVariable Long id){
//        campaignService.removeCampaign(id);
//        return Result.ok();
//    }

}
