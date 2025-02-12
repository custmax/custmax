package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("unsubscribe")
public class Unsubscribe extends BaseEntity {

    @TableField("email")
    private String email;
}
