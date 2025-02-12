package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.entity.PlanPrice;
import com.cusob.entity.Price;

import java.util.List;

public interface PriceService extends IService<Price> {

    /**
     * get Plan Price List
     * @param contactCapacity
     * @param months
     * @param currency
     * @return
     */
    List<Price> getPlanList(Integer contactCapacity, Integer months, Integer currency);

    /**
     * get contact capacity List
     * @return
     */
    List<Integer> getContactList();

    List<Integer> getContactCapacityList();

    Price getPlanById(Long id);

    List<Price> getPlanByContactCapacity(Integer capacity);
}
