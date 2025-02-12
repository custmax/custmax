package com.cusob.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class GroupDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long userId;

    private String groupName;
}
