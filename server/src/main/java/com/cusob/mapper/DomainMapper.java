package com.cusob.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cusob.entity.Domain;
import com.cusob.vo.DomainListVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DomainMapper extends BaseMapper<Domain> {

    /**
     * get DomainList
     * @param userId
     * @return
     */
    List<DomainListVo> getDomainList(@Param("userId") Long userId);
}
