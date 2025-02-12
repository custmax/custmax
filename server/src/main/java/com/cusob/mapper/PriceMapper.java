package com.cusob.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cusob.entity.Price;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PriceMapper extends BaseMapper<Price> {

    /**
     * get contact capacity List
     * @return
     */
    List<Integer> getContactList();

    /**
     * get Plan By id
     * @param id
     * @return
     */
    Price getPlanById(Long id);

    List<Integer> getContactCapacityList();
}
