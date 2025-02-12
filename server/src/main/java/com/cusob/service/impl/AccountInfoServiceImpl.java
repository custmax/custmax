package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.dto.AccountInfoDto;
import com.cusob.entity.AccountInfo;
import com.cusob.exception.CusobException;
import com.cusob.mapper.AccountInfoMapper;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.AccountInfoService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AccountInfoServiceImpl
        extends ServiceImpl<AccountInfoMapper, AccountInfo>
        implements AccountInfoService {


    /**
     * save Account Information
     */
    @Override
    public void saveAccountInfo(AccountInfoDto accountInfoDto) {
        this.paramVerify(accountInfoDto);
        AccountInfo accountInfo = new AccountInfo();
        BeanUtils.copyProperties(accountInfoDto, accountInfo);
        accountInfo.setUserId(AuthContext.getUserId());
        baseMapper.insert(accountInfo);
    }

    /**
     * get account information
     * @return
     */
    @Override
    public AccountInfo getAccountInfo() {
        Long userId = AuthContext.getUserId();
        AccountInfo accountInfo = baseMapper.selectOne(
                new LambdaQueryWrapper<AccountInfo>()
                        .eq(AccountInfo::getUserId, userId)
        );
        return accountInfo;
    }

    /**
     * update account information
     */
    @Override
    public void updateAccountInfo(AccountInfoDto accountInfoDto) {
        this.paramVerify(accountInfoDto);
        AccountInfo accountInfo = this.getAccountInfo();
        BeanUtils.copyProperties(accountInfoDto, accountInfo);
        baseMapper.updateById(accountInfo);
    }

    @Override
    public String getAddr(Long userId) {
        AccountInfo accountInfo = baseMapper.selectOne(new LambdaQueryWrapper<AccountInfo>()
                .eq(AccountInfo::getUserId, userId
                ));

        String address = accountInfo.getAddressLine1() + " " + accountInfo.getAddressLine2();
        if(StringUtils.hasText(address))return address;
        return null;
    }

    private void paramVerify(AccountInfoDto accountInfoDto) {
        if (!StringUtils.hasText(accountInfoDto.getLastName())){
            throw new CusobException(ResultCodeEnum.LAST_NAME_IS_EMPTY);
        }
        if (!StringUtils.hasText(accountInfoDto.getFirstName())){
            throw new CusobException(ResultCodeEnum.FILE_IS_EMPTY);
        }
        if (!StringUtils.hasText(accountInfoDto.getEmail())){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_EMPTY);
        }
        if (!StringUtils.hasText(accountInfoDto.getPhone())){
            throw new CusobException(ResultCodeEnum.PHONE_IS_EMPTY);
        }
        // todo 其他参数校验

    }
}
