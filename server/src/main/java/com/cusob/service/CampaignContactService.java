package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.entity.CampaignContact;

public interface CampaignContactService extends IService<CampaignContact> {

    /**
     * Read Count
     * @param campaignId
     * @param contactId
     */
    void opened(Long campaignId, Long contactId);

    /**
     * batch Save Contact
     * @param campaignId
     * @param groupId
     */
    void batchSaveContact(Long userId, Long campaignId, Long groupId);

    /**
     * update Send Status
     * @param campaignId
     * @param contactId
     */
    void updateSendStatus(Long campaignId, Long contactId);
}
