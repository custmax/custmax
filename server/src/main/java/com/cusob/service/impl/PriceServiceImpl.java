package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.entity.PlanPrice;
import com.cusob.entity.Price;
import com.cusob.exception.CusobException;
import com.cusob.mapper.PriceMapper;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.PriceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriceServiceImpl extends ServiceImpl<PriceMapper, Price> implements PriceService {

    /**
     * get Plan Price List
     * @param contactCapacity
     * @param months
     * @param currency
     * @return
     */
    @Override
    public List<Price> getPlanList(Integer contactCapacity, Integer months, Integer currency) {
        if (contactCapacity==null || months==null || currency==null){
            throw new CusobException(ResultCodeEnum.PARAM_IS_EMPTY);
        }
        List<Price> priceList = baseMapper.selectList(
                new LambdaQueryWrapper<Price>()
                        .eq(Price::getContactCapacity, contactCapacity)
                        .eq(Price::getMonths, months)
                        .eq(Price::getCurrency, currency)
        );
        return priceList;
    }

    /**
     * get contact capacity List
     * @return
     */
    @Override
    public List<Integer> getContactList() {
        List<Integer> list = baseMapper.getContactList();
        return list;
    }
    @Override
    public List<Integer> getContactCapacityList() {
        List<Integer> res = baseMapper.getContactCapacityList();
        return res;
    }
    @Override
    public Price getPlanById(Long id) {
        Price price = baseMapper.selectById(id);
        return price;
    }
    @Override
    public List<Price> getPlanByContactCapacity(Integer capacity) {
        List<Price> prices = baseMapper.selectList(
                new LambdaQueryWrapper<Price>()
                        .eq(Price::getContactCapacity, capacity)
        );
        return prices;
    }
}
