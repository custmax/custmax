package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.entity.Unsubscribe;

import java.util.List;

public interface UnsubscribeService extends IService<Unsubscribe> {

    /**
     * Unsubscribe
     * @param email
     */
    void saveEmail(String email);

    /**
     * select Email List
     * @return
     */
    List<String> selectEmailList();

}
