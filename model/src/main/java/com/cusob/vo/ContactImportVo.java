package com.cusob.vo;

import com.cusob.entity.Contact;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;

@Data

public class ContactImportVo implements Serializable {
    private Long userId;
    private Integer successImport;
    private Integer failImport;
    private Integer repeatImport;
    private ArrayList<String> exceptionStrings;
    //成功解析的列表
    private ArrayList successImportList;
    //重复的列表
    private ArrayList repeatImportList;
    //邮箱不可用的列表
    private ArrayList unavailableImportList;
    //最终成功导入的列表
    private ArrayList<Contact> finalImportList;
}
