package com.cusob.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class TemplateQueryDto implements Serializable {

    private static final long serialVersionUID = 1L;

    private String keyword;

    private String Folder;
}
