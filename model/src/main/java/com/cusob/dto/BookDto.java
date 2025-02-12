package com.cusob.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class BookDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private String name;

    private String email;

    private String phone;

    private String message;

    private String turnstileToken;
}
