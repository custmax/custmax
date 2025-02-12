package com.cusob.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cusob.entity.ApiDomain;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ApiDomainMapper extends BaseMapper<ApiDomain> {
   ApiDomain selectDomainByname(String domain,Long userId);
}
