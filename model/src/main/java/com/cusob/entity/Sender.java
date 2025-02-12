package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("sender")
public class Sender extends BaseEntity {

    @TableField("user_id")
    private Long userId;

    @TableField("email")
    private String email;

    @TableField("server_type")
    private String serverType;

    @TableField("password")
    private String password;

    @TableField("pop_server")
    private String popServer;

    @TableField("pop_port")
    private Integer popPort;

    @TableField("smtp_server")
    private String smtpServer;

    @TableField("smtp_port")
    private Integer smtpPort;

    @TableField("imap_server")
    private String imapServer;

    @TableField("imap_port")
    private Integer imapPort;

    @TableField("imap_Encryption")
    private String imapEncryption;

    @TableField("smtp_Encryption")
    private String smtpEncryption;

    @TableField("pop_Encryption")
    private String popEncryption;

}
