package com.cusob.utils;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.LineCaptcha;
import cn.hutool.captcha.generator.RandomGenerator;
import java.util.HashMap;
import java.util.Map;

public class VerifyCodeUtil {

    public static Map<String, String> generateCaptcha(){
        LineCaptcha lineCaptcha = CaptchaUtil.createLineCaptcha(300, 100, 6, 50);
        RandomGenerator randomGenerator = new RandomGenerator("0123456789", 6);
        lineCaptcha.setGenerator(randomGenerator);

        Map<String, String> map = new HashMap<>();
        map.put("img", lineCaptcha.getImageBase64());
        map.put("captcha", lineCaptcha.getCode());
        return map;
    }

}
