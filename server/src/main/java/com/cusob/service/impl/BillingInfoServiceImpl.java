package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.dto.AccountInfoDto;
import com.cusob.dto.BillingInfoDto;
import com.cusob.entity.AccountInfo;
import com.cusob.entity.BillingInfo;
import com.cusob.exception.CusobException;
import com.cusob.mapper.BillingInfoMapper;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.AccountInfoService;
import com.cusob.service.BillingInfoService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class BillingInfoServiceImpl
        extends ServiceImpl<BillingInfoMapper, BillingInfo>
        implements BillingInfoService {


    /**
     * save billing Information
     * @param billingInfoDto
     */
    @Override
    public void saveBillingInfo(BillingInfoDto billingInfoDto) {
        this.paramVerify(billingInfoDto);
        BillingInfo billingInfo = new BillingInfo();
        BeanUtils.copyProperties(billingInfoDto, billingInfo);
        billingInfo.setUserId(AuthContext.getUserId());
        baseMapper.insert(billingInfo);
    }

    /**
     * get Billing Information
     * @return
     */
    @Override
    public BillingInfo getBillingInfo() {
        Long userId = AuthContext.getUserId();
        BillingInfo billingInfo = baseMapper.selectOne(
                new LambdaQueryWrapper<BillingInfo>()
                        .eq(BillingInfo::getUserId, userId)
        );
        return billingInfo;
    }

    /**
     * update billing Information
     * @param billingInfoDto
     */
    @Override
    public void updateBillingInfo(BillingInfoDto billingInfoDto) {
        this.paramVerify(billingInfoDto);
        BillingInfo billingInfo = this.getBillingInfo();
        BeanUtils.copyProperties(billingInfoDto, billingInfo);
        baseMapper.updateById(billingInfo);
    }

    private void paramVerify(BillingInfoDto billingInfoDto) {
        if (!StringUtils.hasText(billingInfoDto.getLastName())){
            throw new CusobException(ResultCodeEnum.LAST_NAME_IS_EMPTY);
        }
        if (!StringUtils.hasText(billingInfoDto.getFirstName())){
            throw new CusobException(ResultCodeEnum.FIRST_NAME_IS_EMPTY);
        }
        if (!StringUtils.hasText(billingInfoDto.getEmail())){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_EMPTY);
        }
        if (!StringUtils.hasText(billingInfoDto.getPhone())){
            throw new CusobException(ResultCodeEnum.PHONE_IS_EMPTY);
        }
    }


}
