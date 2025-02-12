package com.cusob.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.entity.Unsubscribe;
import com.cusob.mapper.UnsubscribeMapper;
import com.cusob.service.UnsubscribeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UnsubscribeServiceImpl extends ServiceImpl<UnsubscribeMapper, Unsubscribe> implements UnsubscribeService {

    /**
     * Unsubscribe
     * @param email
     */
    @Override
    public void saveEmail(String email) {
        Unsubscribe unsubscribe = new Unsubscribe();
        unsubscribe.setEmail(email);
        baseMapper.insert(unsubscribe);
    }

    /**
     * select Email List
     * @return
     */
    @Override
    public List<String> selectEmailList() {//已过时，现在contact有subscriptionType字段
        List<Unsubscribe> unsubscribeList = baseMapper.selectList(null);
        List<String> emailList = unsubscribeList.stream().
                map(Unsubscribe::getEmail).collect(Collectors.toList());
        return emailList;
    }
}
