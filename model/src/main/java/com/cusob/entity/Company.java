package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

@Data
public class Company extends BaseEntity {

    @TableField("admin_id")
    private Long adminId;

    @TableField("plan_id")
    private Long planId;

    @TableField("company_name")
    private String companyName;

    @TableField("contacts")
    private Integer contacts;

    @TableField("emails")
    private Integer emails;

}
