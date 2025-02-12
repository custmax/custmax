package com.cusob.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class MediaVo implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String fileName;

    private String firstName;

    private String lastName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date createTime;
}
