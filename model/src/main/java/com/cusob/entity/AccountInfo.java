package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("account_info")
public class AccountInfo extends BaseEntity {

    @TableField("user_id")
    private Long userId;

    @TableField("first_name")
    private String firstName;

    @TableField("last_name")
    private String lastName;

    @TableField("company")
    private String company;

    @TableField("address_line1")
    private String addressLine1;

    @TableField("address_line2")
    private String addressLine2;

    @TableField("country")
    private String country;

    @TableField("state")
    private String state;

    @TableField("city")
    private String city;

    @TableField("zip_code")
    private String zipCode;

    @TableField("email")
    private String email;

    @TableField("phone")
    private String phone;

    @TableField("tax_id")
    private String taxId;

}
