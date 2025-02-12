package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.entity.Company;
import com.cusob.vo.PlanDetailVo;

public interface CompanyService extends IService<Company> {

    /**
     * save Company
     * @param company
     */
    void saveCompany(Company company);

    /**
     * update Plan
     * @param adminId
     * @param planId
     */
    void updatePlan(Long adminId, Long planId);

    /**
     * get Plan Detail
     */
    PlanDetailVo getPlanDetail();

    /**
     * @param count
     */
    void updateEmails(Long companyId, int count);
}
