package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.dto.AccountInfoDto;
import com.cusob.dto.BillingInfoDto;
import com.cusob.entity.AccountInfo;
import com.cusob.entity.BillingInfo;

public interface BillingInfoService extends IService<BillingInfo> {

    /**
     * save billing Information
     * @param billingInfoDto
     */
    void saveBillingInfo(BillingInfoDto billingInfoDto);

    /**
     * get Billing Information
     * @return
     */
    BillingInfo getBillingInfo();

    /**
     * update billing Information
     * @param billingInfoDto
     */
    void updateBillingInfo(BillingInfoDto billingInfoDto);
}
