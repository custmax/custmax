package com.cusob.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
public class DomainSenderDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private String email;

    private String password;
}
