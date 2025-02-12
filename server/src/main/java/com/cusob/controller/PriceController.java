package com.cusob.controller;

import com.cusob.entity.Price;
import com.cusob.result.Result;
import com.cusob.service.PriceService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("price")
public class PriceController {

    @Autowired
    private PriceService priceService;

    @ApiOperation("get Plan Price List")
    @GetMapping("getList")
    public Result getPlanList(Integer contactCapacity, Integer months, Integer currency){
        List<Price> priceList = priceService.getPlanList(contactCapacity, months, currency);
        return Result.ok(priceList);
    }

    @ApiOperation("get contact capacity List")
    @GetMapping("getContactList")
    public Result getContactList(){
        List<Integer> list = priceService.getContactList();
        return Result.ok(list);
    }

    @ApiOperation("get Plan By Id")
    @GetMapping("getPlan")
    public Result getPlanById(Long id){
        Price price = priceService.getById(id);
        return Result.ok(price);
    }
}
