package com.cusob.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class DomainDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private String spfDomain;

    private String spfValue;

    private String domain;

    private String dkimDomain;

    private String dkimValue;

    private String mxDomain;

    private String mxValue;

    private String dmarcDomain;

    private String dmarcValue;

    private String cnameDomain;

    private String cnameValue;
}
