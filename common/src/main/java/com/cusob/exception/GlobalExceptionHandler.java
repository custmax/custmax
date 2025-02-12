package com.cusob.exception;

import com.cusob.result.Result;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 自定义异常处理方法
     * @param e
     * @return
     */
    @ExceptionHandler(CusobException.class)
    @ResponseBody
    public Result error(CusobException e){
        return Result.build(null,e.getCode(), e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public Result error(Exception e){
        e.printStackTrace();
        return Result.fail(null);
    }


}
