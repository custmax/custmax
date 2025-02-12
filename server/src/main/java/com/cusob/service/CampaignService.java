package com.cusob.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.dto.CampaignDto;
import com.cusob.dto.CampaignQueryDto;
import com.cusob.entity.Campaign;
import com.cusob.entity.Contact;
import com.cusob.vo.CampaignListVo;

import java.util.List;

public interface CampaignService extends IService<Campaign> {

    /**
     * getLastCampaignId
     * @param
     * @return Long
     */

    public Long getLastCampaignId();

    /**
     * save Campaign
     * @param campaignDto
     */
    Long saveCampaign(CampaignDto campaignDto, Integer status);

    /**
     * get Campaign By Id
     * @param id
     * @return
     */
    Campaign getCampaignById(Long id);

    /**
     * update Campaign
     * @param campaignDto
     */
    void updateCampaign(CampaignDto campaignDto);

    /**
     * get Campaign Page
     * @param pageParam
     * @param campaignQueryDto
     * @return
     */
    IPage<CampaignListVo> getCampaignPage(Page<Campaign> pageParam, CampaignQueryDto campaignQueryDto);

    /**
     * send Email
     * @param campaignDto
     */
    void sendEmail(CampaignDto campaignDto);

    List<Contact> getSendList(Long groupId);


    /**
     * remove Campaign
     * @param id
     */
    void removeCampaign(Long id);

    /**
     * Mass Mailing
     * @param campaign
     */
    void MassMailing(Campaign campaign);

    /**
     * update Status
     */
    void updateStatus(Long campaignId, Integer status);

    Campaign getCampaignByname(String campaignName);
}
