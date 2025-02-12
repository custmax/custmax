package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.entity.EmailSettings;
import com.cusob.mapper.EmailSettingsMapper;
import com.cusob.service.EmailSettingsService;
import org.springframework.stereotype.Service;

@Service
public class EmailSettingsServiceimpl extends ServiceImpl<EmailSettingsMapper, EmailSettings> implements EmailSettingsService {

    @Override
    public EmailSettings getSettings(String suffix) {
        return baseMapper.selectOne(new LambdaQueryWrapper<EmailSettings>()
                .eq(EmailSettings::getNameSuffix, suffix));
    }

}
