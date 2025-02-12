package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;


@Data
@TableName("campaign")
public class Campaign extends BaseEntity {

    public static final Integer DRAFT = 0;
    public static final Integer ONGOING = 1;
    public static final Integer COMPLETED = 2;
    public static final Integer FAIL = 3;

    @TableField("user_id")
    private Long userId;

    @TableField("campaign_name")
    private String campaignName;

    @ApiModelProperty(value = "(0:draft,1:ongoing,2:completed,3:fail)")
    @TableField("status")
    private Integer status;

    @TableField("sender_id")
    private Long senderId;

    @TableField("sender_name")
    private String senderName;

    @TableField("to_group")
    private Long toGroup;

    @TableField("subject")
    private String subject;

    @TableField("pre_text")
    private String preText;

    @TableField("content")
    private String content;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone="GMT+8")
    @TableField("send_time")
    private Date sendTime;

    @TableField("time_zone")
    private String timeZone;

    @TableField("track_opens")
    private Boolean trackOpens;

    @TableField("track_clicks")
    private Boolean trackClicks;

    @TableField("track_text_clicks")
    private Boolean trackTextClicks;

    @TableField("track_link")
    private Boolean trackLink;

}
