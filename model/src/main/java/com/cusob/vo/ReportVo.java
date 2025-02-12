package com.cusob.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class ReportVo implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String campaignName;

    private String groupName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date sendTime;

    private Integer deliverCount;

    private Integer delivered;

    private Integer opened;

    private Integer clicked;

    private Integer hardBounce;

    private Integer softBounce;

    private Integer unsubscribe;
}
