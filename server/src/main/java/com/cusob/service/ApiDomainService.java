package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.dto.ApiDomainDto;
import com.cusob.entity.ApiDomain;

public interface ApiDomainService extends IService<ApiDomain> {
    ApiDomain selectByDomainName(String domain,Long userId);

    void saveDomain(ApiDomainDto apiDomainDto);
}
