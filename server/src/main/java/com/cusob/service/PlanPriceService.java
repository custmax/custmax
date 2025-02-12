package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.entity.PlanPrice;

import java.util.List;

public interface PlanPriceService extends IService<PlanPrice> {

    /**
     * get Contact Capacity List
     * @return
     */
    List<Integer> getContactCapacityList();

//    /**
//     * get Plan By ContactCapacity
//     * @param capacity
//     * @return
//     */
//    List<PlanPrice> getPlanByContactCapacity(Integer capacity);
//
//    /**
//     * get Plan By id
//     * @param id
//     * @return
//     */
    PlanPrice getPlanById(Long id);
}
