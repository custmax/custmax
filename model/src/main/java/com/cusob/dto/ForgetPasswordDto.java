package com.cusob.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class ForgetPasswordDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private String email;

    private String verifyCode;

    private String password;
}
