package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.dto.OrderInfoDto;
import com.cusob.entity.OrderInfo;

public interface OrderInfoService extends IService<OrderInfo> {

    /**
     * save Order Information
     * @param orderInfoDto
     * @param planId
     */
    void saveOrderInfo(OrderInfoDto orderInfoDto, Long planId);

    /**
     * update Order Status
     * @param id
     * @param status
     */

    void updateOrderStatus(Long id, Integer status);

    /**
     * Order Payment
     * @param planId
     */
    String pay(Long planId);
}
