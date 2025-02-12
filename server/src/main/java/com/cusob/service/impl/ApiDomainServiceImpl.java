package com.cusob.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.dto.ApiDomainDto;
import com.cusob.entity.ApiDomain;
import com.cusob.exception.CusobException;
import com.cusob.mapper.ApiDomainMapper;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.ApiDomainService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class ApiDomainServiceImpl extends ServiceImpl<ApiDomainMapper, ApiDomain> implements ApiDomainService {

    @Override
    public ApiDomain selectByDomainName(String domain,Long userId) {
        return baseMapper.selectDomainByname(domain,userId);
    }

    @Override
    public void saveDomain(ApiDomainDto apiDomainDto) {
        ApiDomain apiDomain = new ApiDomain();
        BeanUtils.copyProperties(apiDomainDto,apiDomain);
        apiDomain.setUserId(AuthContext.getUserId());

        save(apiDomain);
    }
}
