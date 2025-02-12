package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("campaign_contact")
public class CampaignContact extends BaseEntity{

    public static final Integer DELIVERED = 1;
    public static final Integer OPENED = 1;

    @TableField("campaign_id")
    private Long campaignId;

    @TableField("contact_id")
    private Long contactId;

    @TableField("is_delivered")
    private Integer isDelivered;

    @TableField("is_opened")
    private Integer isOpened;

    @TableField("is_clicked")
    private Integer isClicked;

}
