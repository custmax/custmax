package com.cusob.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class BillingInfoDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private String firstName;

    private String lastName;

    private String company;

    private String addressLine1;

    private String addressLine2;

    private String country;

    private String state;

    private String city;

    private String zipCode;

    private String email;

    private String phone;

    private String taxId;
}
