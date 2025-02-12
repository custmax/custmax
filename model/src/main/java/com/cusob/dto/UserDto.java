package com.cusob.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class UserDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private String firstName;

    private String lastName;

    private String password;

    private String email;

    private String turnstileToken;

    private String phone;

    private String country;

    private String company;
}
