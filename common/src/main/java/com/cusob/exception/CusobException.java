package com.cusob.exception;

import com.cusob.result.ResultCodeEnum;
import lombok.Data;

@Data
public class CusobException extends RuntimeException {

    //异常状态码
    private Integer code;

    /**
     * 通过状态码和错误消息创建异常对象
     * @param message
     * @param code
     */
    public CusobException(String message, Integer code) {
        super(message);
        this.code = code;
    }

    /**
     * 接收枚举类型对象
     * @param resultCodeEnum
     */
    public CusobException(ResultCodeEnum resultCodeEnum) {
        super(resultCodeEnum.getMessage());
        this.code = resultCodeEnum.getCode();
    }

    @Override
    public String toString() {
        return "CusObException{" +
                "code=" + code +
                ", message=" + this.getMessage() +
                '}';
    }
}
