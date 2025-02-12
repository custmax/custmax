package com.cusob.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@TableName("contact")
@Data
public class Contact extends BaseEntity {

    @TableField("user_id")
    private Long userId;

    @TableField("company_id")
    private Long companyId;

    @TableField("group_id")
    private Long groupId;

    @TableField("valid")
    private int valid;

    @TableField("is_available")
    private int isAvailable;

    @ExcelProperty("First Name")
    @TableField("first_name")
    private String firstName;

    @ExcelProperty("Last Name")
    @TableField("last_name")
    private String lastName;

    @ExcelProperty("Email")
    @TableField("email")
    private String email;

    @ExcelProperty("Mobile")
    @TableField("mobile")
    private String mobile;

    @ExcelProperty("Phone")
    @TableField("phone")
    private String phone;

    @ExcelProperty("Country")
    @TableField("country")
    private String country;

    @ExcelProperty("Company Name")
    @TableField("company")
    private String company;

    @ExcelProperty("Department")
    @TableField("dept")
    private String dept;

    @ExcelProperty("Title")
    @TableField("title")
    private String title;

    @TableField("avatar")
    private String avatar;

    @ExcelProperty("Birthdate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @TableField("birthdate")
    private Date birthDate;

    @ExcelProperty("Note")
    @TableField("note")
    private String note;

    @ExcelProperty("subscriptiontype")
    @TableField("subscriptiontype")
    private String subscriptionType;

}
