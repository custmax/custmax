package com.cusob.dto;


import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;


@Data
public class CampaignDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String campaignName;

    private Long senderId;

    private String senderName;

    private Long toGroup;

    private String subject;

    private String preText;

    private String content;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone="GMT+8")
    private Date sendTime;

    @TableField("time_zone")
    private String timeZone;

    private Boolean trackOpens;

    private Boolean trackClicks;

    private Boolean trackTextClicks;

    private Boolean trackLink;
}
