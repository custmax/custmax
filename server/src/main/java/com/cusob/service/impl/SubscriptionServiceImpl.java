package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.entity.Contact;
import com.cusob.mapper.ContactMapper;
import com.cusob.service.SubscriptionService;
import io.swagger.models.auth.In;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class SubscriptionServiceImpl extends ServiceImpl<ContactMapper, Contact> implements SubscriptionService {

    @Override
    public Map<String, Integer> getSubscriptionCount() {
        Map<String, Integer> map = new HashMap<>();

        // 获取当前用户ID
        Long userId = AuthContext.getUserId();

        // 查询已订阅的联系人数量
        Integer subscribedCount = baseMapper.selectCount(
                new LambdaQueryWrapper<Contact>()
                        .eq(Contact::getUserId, userId)
                        .eq(Contact::getSubscriptionType, "Subscribed")
        );
        map.put("Subscribed", subscribedCount);

        // 查询未订阅的联系人数量
        Integer unsubscribedCount = baseMapper.selectCount(
                new LambdaQueryWrapper<Contact>()
                        .eq(Contact::getUserId, userId)
                        .eq(Contact::getSubscriptionType, "Unsubscribed")
        );
        map.put("Unsubscribed", unsubscribedCount);

        // 查询未订阅或非订阅的联系人数量
        Integer nonSubscribedCount = baseMapper.selectCount(
                new LambdaQueryWrapper<Contact>()
                        .eq(Contact::getUserId, userId)
                        .eq(Contact::getSubscriptionType, "Non-subscribed")
        );
        map.put("Non-subscribed", nonSubscribedCount);
//        System.out.println("SDFHAJHFSDAJKFHSKAJHFJKL");
        // 返回结果Map
        return map;
    }
}
