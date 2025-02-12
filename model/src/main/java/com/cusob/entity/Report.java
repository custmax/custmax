package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("report")
public class Report extends BaseEntity {

    @TableField("user_id")
    private Long userId;

    @TableField("company_id")
    private Long companyId;

    @TableField("campaign_id")
    private Long campaignId;

    @TableField("group_id")
    private Long groupId;

    @TableField("deliver_count")
    private Integer deliverCount;

    @TableField("delivered")
    private Integer delivered;

    @TableField("opened")
    private Integer opened;

    @TableField("clicked")
    private Integer clicked;

    @TableField("hard_bounce")
    private Integer hardBounce;

    @TableField("soft_bounce")
    private Integer softBounce;

    @TableField("unsubscribe")
    private Integer unsubscribe;

}
