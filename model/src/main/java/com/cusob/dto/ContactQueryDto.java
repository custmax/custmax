package com.cusob.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class ContactQueryDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private String keyword;

    private Long groupId;
    private String subscriptionType;

}
