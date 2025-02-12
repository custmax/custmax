package com.cusob.dto;

import lombok.Data;
import java.io.Serializable;

@Data
public class  SenderDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String email;

    private String serverType;

    private String password;

    private String popServer;

    private Integer popPort;

    private String smtpServer;

    private Integer smtpPort;

    private String imapServer;

    private Integer imapPort;

    private String imapEncryption;

    private String smtpEncryption;

    private String popEncryption;

}
