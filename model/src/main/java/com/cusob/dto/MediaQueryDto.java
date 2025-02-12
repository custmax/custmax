package com.cusob.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class MediaQueryDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private String keyword;

    private String type;

    private Date date;
}
