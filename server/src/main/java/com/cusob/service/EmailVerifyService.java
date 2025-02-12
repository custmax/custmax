package com.cusob.service;

import com.cusob.result.Result;

import java.util.List;
import java.util.Map;

public interface EmailVerifyService {
    Result<Map<String, Boolean>> verifyEmail(List<String> emails);
}
