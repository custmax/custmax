package com.cusob.dto;

import lombok.Data;
import java.io.Serializable;

@Data
public class TemplateDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String subject;

    private String folder;

    private Integer type;

    private String content;

}
