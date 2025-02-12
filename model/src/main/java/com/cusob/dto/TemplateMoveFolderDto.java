package com.cusob.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class TemplateMoveFolderDto implements Serializable {
    private static final long serialVersionUID = 1L;
    private String folderName;
    private List<Long> templateIds;
}
