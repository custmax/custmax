package com.cusob.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;


@Data
public class CampaignListVo implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String campaignName;

    private Integer status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone="GMT+8")
    private Date updateTime;
}
