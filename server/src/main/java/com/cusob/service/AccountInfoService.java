package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.dto.AccountInfoDto;
import com.cusob.entity.AccountInfo;

public interface AccountInfoService extends IService<AccountInfo> {

    /**
     * save Account Information
     */
    void saveAccountInfo(AccountInfoDto accountInfoDto);

    /**
     * get account information
     * @return
     */
    AccountInfo getAccountInfo();

    /**
     * update account information
     */
    void updateAccountInfo(AccountInfoDto accountInfoDto);

    String getAddr(Long userId);
}
