package com.cusob.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("domain")
public class Domain extends BaseEntity {

//    @TableField("user_id")
//    private Long userId;
//
//    @TableField("domain")
//    private String domain;
//
//    @TableField("spf")
//    private Boolean spf;
//
//    @TableField("dkim")
//    private Boolean dkim;
    @TableField("user_id")
    private Long userId;

    @TableField("domain")
    private String domain;

    @TableField("status")
    private Integer status;

    @TableField("spf_domain")
    private String spfDomain;

    @TableField("spf_value")
    private String spfValue;

    @TableField("spf_verify")
    private Integer spfVerify;

    @TableField("dkim_domain")
    private String dkimDomain;

    @TableField("dkim_value")
    private String dkimValue;

    @TableField("dkim_verify")
    private Integer dkimVerify;

    @TableField("dmarc_domain")
    private String dmarcDomain;

    @TableField("dmarc_value")
    private String dmarcValue;

    @TableField("dmarc_verify")
    private Integer dmarcVerify;

    @TableField("mx_domain")
    private String mxDomain;

    @TableField("mx_value")
    private String mxValue;

    @TableField("mx_verify")
    private Integer mxVerify;

    @TableField("cname_domain")
    private String cnameDomain;

    @TableField("cname_value")
    private String cnameValue;

    @TableField("cname_verify")
    private Integer cnameVerify;
}
