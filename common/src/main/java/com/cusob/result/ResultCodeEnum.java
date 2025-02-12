package com.cusob.result;

import lombok.Getter;

@Getter
public enum ResultCodeEnum {

    SUCCESS(200,"success"),
    FAIL(201, "fail"),

    SERVICE_ERROR(203, "服务异常"),
    DATA_ERROR(204, "数据异常"),
    ILLEGAL_REQUEST(205, "非法请求"),
    REPEAT_SUBMIT(206, "重复提交"),

    // TODO 待修改
    USER_IS_DISABLE(208, "Your acount is not activated yet, Please check the email we resend you and click the link to activate your account."),
    NO_PERMISSION(209, "Free users don't have permissions"),

    OLD_PASSWORD_EMPTY(210, "Old password is empty"),
    OLD_PASSWORD_WRONG(211, "Old password is wrong"),

    USER_NUMBER_FULL(212, "The number of user seats is full"),
    CONTACT_NUMBER_FULL(213, "The number of contacts exceeds the limit"),
    EMAIL_NUMBER_FULL(214, "The number of emails that can be sent exceeds the limit"),

    NAME_IS_EMPTY(215, "The name is empty"),
    REMOVE_YOURSELF_WRONG(216, "You can't delete yourself"),
    EMAIL_FORMAT_ERROR(217, "The email format is wrong"),

    EMAIL_NOT_EXIST(220, "Email is not registered"),
    PASSWORD_WRONG(221, "Incorrect email or password"),

    EMAIL_IS_REGISTERED(222, "The email is already registered"),
    EMAIL_IS_EMPTY(223, "The email is empty"),
    PHONE_IS_EMPTY(224, "The phone number is empty"),
    PASSWORD_IS_EMPTY(225, "The password is empty"),
    LAST_NAME_IS_EMPTY(226, "The last name is empty"),
    FIRST_NAME_IS_EMPTY(227, "The first name is empty"),
    COUNTRY_IS_EMPTY(228, "The country is empty"),
    SERVER_TYPE_IS_EMPTY(229, "The server type is empty"),

    GROUP_NAME_EMPTY(230, "The group name is empty"),
    GROUP_NAME_ALREADY_EXISTS(231, "The group name already exists"),
    GROUP_CONTAINS_CONTACTS(232, "Contacts exist in the current group"),

    COMPANY_IS_EMPTY(233, "The company is empty"),
    USER_IS_ADMIN(234, "The user is already an administrator"),
    NO_OPERATION_PERMISSIONS(235, "No operation permissions"),
    REMOVE_ADMIN_FAIL(236, "Remove admin fail"),
    UPDATE_CONTACT_FAIL(237, "You can't modify another user's contacts"),


    EMAIL_RECIPIENT_EMPTY(240, "The recipient of the email cannot be empty"),
    EMAIL_SUBJECT_EMPTY(241, "The subject of the email cannot be empty"),
    EMAIL_CONTENT_EMPTY(242, "The content of the email cannot be empty"),
    EMAIL_SEND_FAIL(243, "The email failed to be sent"),

    KEY_GENERATE_FAIL(245, "The key generation failed"),
    PARAM_IS_EMPTY(246, "The parameter is empty"),
    DOMAIN_IS_EMPTY(247, "The domain is empty"),
    EMAIL_IS_BOUND(248, "The email address has been bound"),
    EMAIL_IS_INVALID(249,"The email does not exist,please check your spelling"),

    VERIFY_CODE_EMPTY(250, "The verify code is empty"),
    VERIFY_CODE_WRONG(251, "Cloudflare verification failed, please try again"),
    GENERATE_CAPTCHA_FAIL(252, "Failed to generate a verification code"),

    FILE_IS_Abnormal(255, "The file is abnormal"),
    FILE_IS_EMPTY(256, "The file is empty"),

    TEMPLATE_NAME_EMPTY(260, "The template name is empty"),
    TEMPLATE_SUBJECT_EMPTY(261, "The template subject is empty"),
    TEMPLATE_FOLDER_EMPTY(262, "The template folder is empty"),
    TEMPLATE_REMOVE_ERROR(263, "The system templates cannot be deleted"),
    TEMPLATE_UPDATE_ERROR(263, "The system templates cannot be updated"),

    INVITE_LINK_INVALID(270, "The invitation link is invalid"),
    EMAIL_NOT_INVITED(271, "The email is not invited"),

    ADDRESS_IS_EMPTY(272, "The address is empty"),
    PAYMENT_METHOD_ERROR(273, "The payment method is error"),

    ORDER_PAYMENT_ABNORMAL(280, "The order payment is abnormal"),

    SENDER_NAME_EMPTY(290, "The sender name is empty"),
    SENDER_IS_EMPTY(291, "The sender is empty"),
    RECIPIENT_IS_EMPTY(292, "The recipient is empty"),
    SUBJECT_IS_EMPTY(293, "The subject is empty"),
    CONTENT_IS_EMPTY(294, "The content is empty"),
    SEND_TIME_EMPTY(295, "The send time is empty"),
    EMAIL_CATEGORY_NOEXIST(296,"The email service provider does not support"),
    CONTACT_IS_EXISTED(297,"The contact has already existed in your contact list "),
    TITLE_IS_EXISTED(298,"The title has already existed in your campaign list"),
    DOMAIN_IS_EXISTED(299,"The domain has already existed in your Domain list"),

    FOLDER_IS_EMPTY(2991,"FOLDER_IS_EMPTY"),
    REDIS_IS_ERROR(20001,"REDIS_IS_ERROR"),
    EMAIL_IS_ERROR(20101,"EMAIL_IS_ERROR"),
    REDRICT_SUCCESS(301, "REDRICT"),


    ;

    private Integer code;

    private String message;

    private ResultCodeEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}

