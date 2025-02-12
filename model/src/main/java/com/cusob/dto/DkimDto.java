package com.cusob.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

@Data
public class DkimDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private String domain;

    @JsonProperty("dkim")
    private String publicKey;

    private String dmarcValue;
}
