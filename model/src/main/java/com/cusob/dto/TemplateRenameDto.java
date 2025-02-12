package com.cusob.dto;

import lombok.Data;

import java.io.Serializable;
@Data
public class TemplateRenameDto implements Serializable {
    private static final long serialVersionUID = 1L;
    private String templateName;
    private String newTemplateName;
}
