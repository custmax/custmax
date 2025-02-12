package com.cusob.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.entity.OrderHistory;

public interface OrderHistoryService extends IService<OrderHistory> {

    /**
     * save Order History
     * @param orderHistory
     */
    void saveOrderHistory(OrderHistory orderHistory);

    /**
     * get Order History Page
     * @param pageParam
     * @return
     */
    IPage<OrderHistory> getOrderHistoryPage(Page<OrderHistory> pageParam);
}
