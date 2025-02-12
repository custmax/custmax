package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.entity.Company;
import com.cusob.entity.PlanPrice;
import com.cusob.entity.Price;
import com.cusob.entity.User;
import com.cusob.mapper.CompanyMapper;
import com.cusob.service.*;
import com.cusob.vo.PlanDetailVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyServiceImpl extends ServiceImpl<CompanyMapper, Company> implements CompanyService {

    @Autowired
    private PlanPriceService planService;

    @Autowired
    private ContactService contactService;
    @Autowired
    private PriceService priceService;

    /**
     * save Company
     * @param company
     */
    @Override
    public void saveCompany(Company company) {
        baseMapper.insert(company);
    }

    /**
     * update Plan
     * @param adminId
     * @param planId
     */
    @Override
    public void updatePlan(Long adminId, Long planId) {
        Company company = baseMapper.selectOne(
                new LambdaQueryWrapper<Company>()
                        .eq(Company::getAdminId, adminId)
        );
        company.setPlanId(planId);
        baseMapper.updateById(company);
    }

    /**
     * get Plan Detail
     */
    @Override
    public PlanDetailVo getPlanDetail() {
        Company company = baseMapper.selectById(AuthContext.getCompanyId());
        Price plan = priceService.getPlanById(company.getPlanId());
        //PlanPrice plan = planService.getPlanById(company.getPlanId());
        PlanDetailVo planDetailVo = new PlanDetailVo();

        planDetailVo.setPlanName(plan.getName());
        planDetailVo.setContactCapacity(plan.getContactCapacity());
        planDetailVo.setEmailCapacity(plan.getEmailCapacity());

        Integer contactCount = contactService.selectCountByCompanyId(AuthContext.getCompanyId());
        planDetailVo.setContactCount(contactCount);
        planDetailVo.setEmailCount(company.getEmails());
        return planDetailVo;
    }

    /**
     * update Contacts
     * @param count
     */
    @Override
    public void updateEmails(Long companyId, int count) {
        Company company = baseMapper.selectById(companyId);
        company.setEmails(company.getEmails() + count);//更新用户所在公司已发送的邮件数量
        baseMapper.updateById(company);
    }

}
