package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.entity.EmailSettings;

public interface EmailSettingsService extends IService<EmailSettings> {
    EmailSettings getSettings(String suffix);

}
