package com.cusob.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class CampaignQueryDto implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Integer CREATED_TIME = 0;
    public static final Integer UPDATED_TIME = 1;

    private String name;

    private Integer status;

    private Integer order; // order by CREATED_TIME or UPDATED_TIME
}
