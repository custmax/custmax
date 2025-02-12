package com.cusob.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cusob.entity.OrderHistory;
import com.cusob.result.Result;
import com.cusob.service.OrderHistoryService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("orderHistory")
public class OrderHistoryController {

    @Autowired
    private OrderHistoryService orderHistoryService;

    @ApiOperation("save Order History")
    @PostMapping("save")
    public Result saveOrderHistory(@RequestBody OrderHistory orderHistory){
        orderHistoryService.saveOrderHistory(orderHistory);
        return Result.ok();
    }

    @ApiOperation("get Order History Page")
    @GetMapping("getList/{page}/{limit}")
    public Result getOrderHistoryPage(@PathVariable Long page,
                                      @PathVariable Long limit){
        Page<OrderHistory> pageParam = new Page<>(page, limit);
        IPage<OrderHistory> orderHistoryPage = orderHistoryService.getOrderHistoryPage(pageParam);
        return Result.ok(orderHistoryPage);
    }
}
