package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.entity.PlanPrice;
import com.cusob.mapper.PlanPriceMapper;
import com.cusob.service.PlanPriceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanPriceServiceImpl extends ServiceImpl<PlanPriceMapper, PlanPrice> implements PlanPriceService {

    /**
     * get Contact Capacity List
     * @return
     */
    @Override
    public List<Integer> getContactCapacityList() {
        List<Integer> res = baseMapper.getContactCapacityList();
        return res;
    }

    /**
     * get Plan By ContactCapacity
     * @param capacity
     * @return
     */
//    @Override
//    public List<PlanPrice> getPlanByContactCapacity(Integer capacity) {
//        List<PlanPrice> planPrices = baseMapper.selectList(
//                new LambdaQueryWrapper<PlanPrice>()
//                        .eq(PlanPrice::getContactCapacity, capacity)
//        );
//        return planPrices;
//    }

    /**
     * get Plan By id
     * @param id
     * @return
     */
    @Override
    public PlanPrice getPlanById(Long id) {
        PlanPrice planPrice = baseMapper.selectById(id);
        return planPrice;
    }
}
