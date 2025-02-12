package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("contact_groups")
public class Group extends BaseEntity {

    @TableField("user_id")
    private Long userId;

    @TableField("group_name")
    private String groupName;

}
