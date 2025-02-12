package com.cusob.controller;

import com.cusob.dto.OrderInfoDto;
import com.cusob.result.Result;
import com.cusob.service.OrderInfoService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orderInfo")
public class OrderInfoController {

    @Autowired
    private OrderInfoService orderInfoService;

    @ApiOperation("submit order")
    @PostMapping("submitOrder")
    public Result submitOrder(@RequestBody OrderInfoDto orderInfoDto, Long planId){
        // 生成订单
        orderInfoService.saveOrderInfo(orderInfoDto, planId);
        // 订单支付
        String payUrl = orderInfoService.pay(planId);
        return Result.ok(payUrl);
    }

    @ApiOperation("update Order Status")
    @PostMapping("updateStatus")
    public Result updateOrderStatus(Long id, Integer status){
        orderInfoService.updateOrderStatus(id, status);
        return Result.ok();
    }

}
