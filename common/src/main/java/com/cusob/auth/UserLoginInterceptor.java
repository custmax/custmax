package com.cusob.auth;

import com.cusob.properties.JwtProperties;
import com.cusob.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class UserLoginInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtProperties jwtProperties;


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //判断当前拦截到的是Controller的方法还是其他资源
        if (!(handler instanceof HandlerMethod)) {
            //当前拦截到的不是动态方法，直接放行
            return true;
        }

        return this.initUserLoginVo(request, response);
    }

    private boolean initUserLoginVo(HttpServletRequest request, HttpServletResponse response) {
        try {
            // 请求头获取token
            String token = request.getHeader("token");
            Claims claims = JwtUtil.parseJWT(jwtProperties.getSecretKey(), token);
            Long userId = Long.valueOf(claims.get("userId").toString());
            Long companyId = Long.valueOf(claims.get("companyId").toString());
            AuthContext.setUserId(userId);
            AuthContext.setCompanyId(companyId);
            return true;
        }catch (Exception e){
            response.setStatus(401);
            return false;
        }

    }
}
