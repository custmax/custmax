package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
@TableName("order_info")
public class OrderInfo extends BaseEntity{

    public static final Integer UNPAID = 0;  // 未支付
    public static final Integer PAYING = 1;  // 正在支付
    public static final Integer COMPLETED = 2;  // 支付完成
    public static final Integer CANCEL = 3;  // 取消支付

    public static final Integer PAYPAL = 0;
    public static final Integer VISA = 1;

    @TableField("user_id")
    private Long userId;

    @TableField("payment_method")
    private Integer paymentMethod;

    @ApiModelProperty(value = "(0:未支付 1:支付中 2:支付完成 3:取消支付)")
    @TableField("payment_status")
    private Integer paymentStatus;

    @TableField("pay_time")
    private Date payTime;

    @TableField("account_first_name")
    private String accountFirstName;

    @TableField("account_last_name")
    private String accountLastName;

    @TableField("account_company")
    private String accountCompany;

    @TableField("account_address_line1")
    private String accountAddressLine1;

    @TableField("account_address_line2")
    private String accountAddressLine2;

    @TableField("account_country")
    private String accountCountry;

    @TableField("account_state")
    private String accountState;

    @TableField("account_city")
    private String accountCity;

    @TableField("account_zip_code")
    private String accountZipCode;

    @TableField("account_email")
    private String accountEmail;

    @TableField("account_phone")
    private String accountPhone;

    @TableField("billing_first_name")
    private String billingFirstName;

    @TableField("billing_last_name")
    private String billingLastName;

    @TableField("billing_company")
    private String billingCompany;

    @TableField("billing_address_line1")
    private String billingAddressLine1;

    @TableField("billing_address_line2")
    private String billingAddressLine2;

    @TableField("billing_country")
    private String billingCountry;

    @TableField("billing_state")
    private String billingState;

    @TableField("billing_city")
    private String billingCity;

    @TableField("billing_zip_code")
    private String billingZipCode;

    @TableField("billing_email")
    private String billingEmail;

    @TableField("billing_phone")
    private String billingPhone;

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
