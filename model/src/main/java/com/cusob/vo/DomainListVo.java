package com.cusob.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class DomainListVo implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String domain;

    private Boolean spf;

    private Boolean dkim;
}
