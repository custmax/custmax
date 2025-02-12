package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

@Data
@TableName("price")
public class Price extends BaseEntity {

    @TableField("name")
    private String name;

    @TableField("contact_capacity")
    private Integer contactCapacity;

    @TableField("email_capacity")
    private Integer emailCapacity;

    @TableField("currency")
    private Integer currency;

    @TableField("price_usd")
    private BigDecimal priceUSD;

    @TableField("discount_usd")
    private BigDecimal discountUSD;

    @TableField("amount_usd")
    private BigDecimal amountUSD;

    @TableField("price_eur")
    private BigDecimal priceEUR;

    @TableField("discount_eur")
    private BigDecimal discountEUR;

    @TableField("amount_eur")
    private BigDecimal amountEUR;

    @TableField("price_hkd")
    private BigDecimal priceHKD;

    @TableField("discount_hkd")
    private BigDecimal discountHKD;

    @TableField("amount_hkd")
    private BigDecimal amountHKD;

    @TableField("price_jpy")
    private BigDecimal priceJPY;

    @TableField("discount_jpy")
    private BigDecimal discountJPY;

    @TableField("amount_jpy")
    private BigDecimal amountJPY;

    @TableField("months")
    private Integer months;

    @TableField("is_available")
    private Integer isAvailable;
}
