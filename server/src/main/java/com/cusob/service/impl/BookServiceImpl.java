package com.cusob.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.constant.MqConst;
import com.cusob.dto.BookDto;
import com.cusob.entity.Book;
import com.cusob.exception.CusobException;
import com.cusob.mapper.BookMapper;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.BookService;
import com.cusob.service.MailService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

@Service
public class BookServiceImpl extends ServiceImpl<BookMapper, Book> implements BookService {

    @Resource
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private MailService mailService;

    @Value("${cusob.email.brooks}")
    private String mailBrooks;


    @Value("${cusob.cf-secret-key}")
    private String turnstileSecretKey ;

    private final RestTemplate restTemplate;

    public BookServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * book a demo
     * @param bookDto
     */
    @Override
    public void bookDemo(BookDto bookDto) {
        this.paramVerify(bookDto);
        Book book = new Book();
        BeanUtils.copyProperties(bookDto, book);
        baseMapper.insert(book);
        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_BOOK_DIRECT,
                MqConst.ROUTING_BOOK_DEMO, book);
    }

    /**
     * email Notify
     * @param book
     */
    @Override
    public void emailNotify(Book book) {
        String name = book.getName();
        String subject = name + " is booking a Demo";
        name = "name: " + name;
        String email = "email: " + book.getEmail();
        String phone = "phone: " + book.getPhone();
        String message = "message: " + book.getMessage();
        String content = name + "\n" + email + "\n" + phone + "\n" + message;
        String mail = mailBrooks;
        mailService.sendTextMailMessage(mail, subject, content);
    }

    private void paramVerify(BookDto bookDto) {
        if (!StringUtils.hasText(bookDto.getName())){
            throw new CusobException(ResultCodeEnum.NAME_IS_EMPTY);
        }
        if (!StringUtils.hasText(bookDto.getEmail())){
            throw new CusobException(ResultCodeEnum.EMAIL_IS_EMPTY);
        }
        if (!StringUtils.hasText(bookDto.getPhone())){
            throw new CusobException(ResultCodeEnum.PHONE_IS_EMPTY);
        }

        String turnstileToken = bookDto.getTurnstileToken();
        String url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("secret", turnstileSecretKey);
        requestBody.put("response", turnstileToken);

        Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);
        if (!(response != null && Boolean.TRUE.equals(response.get("success")))) {
            throw new CusobException(ResultCodeEnum.VERIFY_CODE_WRONG);
        }
    }
}
