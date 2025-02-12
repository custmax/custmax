package com.cusob.controller;

import com.cusob.dto.GroupDto;
import com.cusob.entity.Group;
import com.cusob.result.Result;
import com.cusob.service.GroupService;
import com.cusob.service.SubscriptionService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/subscription")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;


    @ApiOperation("get subscription Count")
    @GetMapping("getSubscriptionCount")
    public Result getGroupsAndContactCount(){
//        System.out.println("SDFHAJHFSDAJKFHSKAJHFJKL");
        Map<String, Integer> map = subscriptionService.getSubscriptionCount();
        return Result.ok(map);
    }


}
