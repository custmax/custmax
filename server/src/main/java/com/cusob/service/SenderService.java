package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.dto.SenderDto;
import com.cusob.entity.Sender;

import java.util.List;

public interface SenderService extends IService<Sender> {

    /**
     * save Sender
     * @param senderDto
     */
    void saveSender(SenderDto senderDto);

    void saveDomainSender(String email,String password);

    void checkEmail(String email);

    String check(String uuid);

    void createSender(String email,String password);

    /**
     * get Sender By UserId
     */
    Sender getSenderByUserId();

    /**
     * update Sender
     * @param senderDto
     */
    void updateSender(SenderDto senderDto);

    /**
     * remove Sender
     */
    void removeSenderById(Long id);

    /**
     * send verify code for binding sender
     * @param email
     */
    void sendCodeForSender(String email);

    /**
     * get Sender List
     * @return
     */
    List<Sender> getSenderList();

    String selectByEmail(String email);
}
