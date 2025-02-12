package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

@Data
@TableName("order_history")
public class OrderHistory extends BaseEntity {

    public static final Integer PAYPAL = 0;
    public static final Integer VISA = 1;
    public static final Integer WECHAT = 2;
    public static final Integer ALIPAY = 3;

    @TableField("order_id")
    private Long orderId;

    @TableField("company_id")
    private Long companyId;

    @TableField("user_id")
    private Long userId;

    @TableField("payment_method")
    private Integer paymentMethod;

    @TableField("plan_id")
    private Long planId;

    @TableField("plan_name")
    private String planName;

    @TableField("contact_capacity")
    private Integer contactCapacity;

    @TableField("email_capacity")
    private Integer emailCapacity;

    @TableField("price")
    private BigDecimal price;

    @TableField("discounts")
    private BigDecimal discounts;

    @TableField("tax")
    private BigDecimal tax;

    @TableField("total_amount")
    private BigDecimal totalAmount;
}
