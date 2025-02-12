package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

@Data
@TableName("plan_price")
public class PlanPrice extends BaseEntity {

    public static final Long FREE = 1L;
    public static final String ESSENTIALS = "Essentials";
    public static final String STANDARD = "Standard";

    public static final Integer ESSENTIALS_USER_LIMIT = 5;
    public static final Integer STANDARD_USER_LIMIT = 10;

    public static final String USD = "USD";
    public static final String CNY = "CNY";

    @TableField("name")
    private String name;

    @TableField("contact_capacity")
    private Integer contactCapacity;

    @TableField("email_capacity")
    private Integer emailCapacity;

    @TableField("price")
    private BigDecimal price;

}
