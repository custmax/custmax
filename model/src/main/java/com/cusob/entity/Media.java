package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@TableName("media")
@Data
public class Media extends BaseEntity{

    @TableField("user_id")
    private Long userId;

    @TableField("company_id")
    private Long companyId;

    @TableField("file_name")
    private String fileName;

    @TableField("type")
    private String type;

    @TableField("url")
    private String url;

}
