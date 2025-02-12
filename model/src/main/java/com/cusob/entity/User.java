package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;


@Data
@TableName("user")
public class User extends BaseEntity {

    public static final Integer USER = 0;
    public static final Integer ADMIN = 1;
    public static final Integer SUPER_ADMIN = 2;

    public static final Integer DISABLE = 0;
    public static final Integer AVAILABLE = 1;

    @TableField("company_id")
    private Long companyId;

    @TableField("first_name")
    private String firstName;

    @TableField("last_name")
    private String lastName;

    @TableField("password")
    private String password;

    @TableField("email")
    private String email;

    @TableField("phone")
    private String phone;

    @TableField("country")
    private String country;

    @TableField("company")
    private String company;

    @TableField("avatar")
    private String avatar;

    @TableField("permission")
    private Integer permission;

    @TableField("is_available")
    private Integer isAvailable;
}
