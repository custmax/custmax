package com.cusob.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;


@Data
public class PromptDto implements Serializable {

    private static final long serialVersionUID = 1L;

    //private Long id;

    private String groupId;

    private String content;
}
