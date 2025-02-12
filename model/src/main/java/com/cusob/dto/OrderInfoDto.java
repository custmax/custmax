package com.cusob.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.io.Serializable;

@Data
public class OrderInfoDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer paymentMethod;

    private String accountFirstName;

    private String accountLastName;

    private String accountCompany;

    private String accountAddressLine1;

    private String accountAddressLine2;

    private String accountCountry;

    private String accountState;

    private String accountCity;

    private String accountZipCode;

    private String accountEmail;

    private String accountPhone;

    private String billingFirstName;

    private String billingLastName;

    private String billingCompany;

    private String billingAddressLine1;

    private String billingAddressLine2;

    private String billingCountry;

    private String billingState;

    private String billingCity;

    private String billingZipCode;

    private String billingEmail;

    private String billingPhone;

}
