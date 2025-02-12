package com.cusob.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmailServerInfo {
    private String smtpServer;

    private int smtpPort;

    private String imapServer;

    private int imapPort;
}
