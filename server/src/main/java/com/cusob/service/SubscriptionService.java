package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.dto.GroupDto;

import java.util.List;
import java.util.Map;

public interface SubscriptionService{


    /**
     * get Groups And Contact Count
     * @return
     */
    Map<String, Integer> getSubscriptionCount();
}
