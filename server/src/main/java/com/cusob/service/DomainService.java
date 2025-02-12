package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.entity.Domain;
import com.cusob.vo.DomainListVo;

import java.util.List;
import java.util.Map;

public interface DomainService extends IService<Domain> {

    /**
     * domain Verify
     * @param domain
     * @return
     */
    Map<String, Boolean> domainVerify(String domain);

    /**
     * get DomainList
     * @return
     */
    List<Domain> getDomainList();

    /**
     * get Domain
     * @param domain
     */
    Domain getByDomain(String domain);
}
