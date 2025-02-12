package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@TableName("email_settings")
@Data
public class EmailSettings extends BaseEntity {

    @TableField("name_suffix")
    private String nameSuffix;

    @TableField("smtp_server")
    private String smtpServer;

    @TableField("imap_server")
    private String imapServer;

    @TableField("pop_server")
    private String popServer;

    @TableField("start_tls")
    private Integer startTls;

}
