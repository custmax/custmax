package com.cusob.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class ContactVo implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private int isAvailable;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String company;

    private String groupName;

    private String subscriptionType;

}
