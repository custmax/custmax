package com.cusob.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class PlanDetailVo implements Serializable {

    private static final long serialVersionUID = 1L;

    private String planName;

    private Integer ContactCapacity;

    private Integer ContactCount;

    private Integer EmailCapacity;

    private Integer EmailCount;

}
