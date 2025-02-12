package com.cusob.controller;

import com.cusob.entity.PlanPrice;
import com.cusob.entity.Price;
import com.cusob.result.Result;
import com.cusob.service.PlanPriceService;
import com.cusob.service.PriceService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/plan/price")
public class PlanPriceController {

//    8.19将PlanPriceService改为PriceService
    @Autowired
    private PlanPriceService planPriceService;
    @Autowired
    private PriceService priceService;
    @ApiOperation("get Contact Capacity List")
    @GetMapping("getContactCapacityList")
    public Result getContactCapacityList(){
        List<Integer> res = priceService.getContactCapacityList();
        return Result.ok(res);
    }

    @ApiOperation("get Plan By ContactCapacity")
    @GetMapping("getPlanByContactCapacity")
    public Result getPlanByContactCapacity(Integer capacity){
        List<Price> res = priceService.getPlanByContactCapacity(capacity);
        return Result.ok(res);
    }

    @ApiOperation("get Plan By Id")
    @GetMapping("getPlanById")
    public Result getPlanById(Long id){
        PlanPrice planPrice = planPriceService.getPlanById(id);
        return Result.ok(planPrice);
    }
}
