package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

@Data
@TableName("template")
public class Template extends BaseEntity {

    public static final Integer SYSTEM = 0;

    public static final Integer CUSTOMIZED = 1;

    @TableField("name")
    private String name;

    @TableField("subject")
    private String subject;

    @TableField("folder")
    private String folder;

    @TableField("type")
    private Integer type;

    @TableField("content")
    private String content;

    @TableField("is_customized")
    private Integer isCustomized;

    @TableField("user_id")
    private Long userId;

    @TableField("price")
    private BigDecimal price;
}
