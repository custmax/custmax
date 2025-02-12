package com.cusob.service;

import com.cusob.dto.PromptDto;

public interface AIService{


    String generateByGroup(PromptDto promptDto);
}
