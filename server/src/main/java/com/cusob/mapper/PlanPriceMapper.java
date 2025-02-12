package com.cusob.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cusob.entity.PlanPrice;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PlanPriceMapper extends BaseMapper<PlanPrice> {

    /**
     * get Contact Capacity List
     * @return
     */
    List<Integer> getContactCapacityList();
}
