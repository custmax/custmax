package com.cusob.receiver;

import com.cusob.constant.MqConst;
import com.cusob.entity.Book;
import com.cusob.entity.Email;
import com.cusob.entity.Report;
import com.cusob.service.BookService;
import com.cusob.service.MailService;
import com.cusob.service.ReportService;
import com.cusob.service.UserService;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.Map;

@Component
public class MailReceiver {

    @Autowired
    private MailService mailService;

    @Autowired
    private UserService userService;

    @Autowired
    private BookService bookService;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = MqConst.QUEUE_SEND_CODE, durable = "true"),
            exchange = @Exchange(value = MqConst.EXCHANGE_SIGN_DIRECT),
            key = {MqConst.ROUTING_SEND_CODE}
    ))
    public void sendVerifyCodeToRegister(Email mail, Message message, Channel channel) throws IOException {
        try {
            if (StringUtils.hasText(mail.getEmail())){
                mailService.sendHtmlMailMessage(mail.getEmail(), mail.getSubject(), mail.getContent());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        } finally {
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        }
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = MqConst.QUEUE_INVITE_USER, durable = "true"),
            exchange = @Exchange(value = MqConst.EXCHANGE_INVITE_DIRECT),
            key = {MqConst.ROUTING_INVITE_USER}
    ))
    public void inviteUser(Email mail, Message message, Channel channel) throws IOException {
        try {
            if (StringUtils.hasText(mail.getEmail())){
                mailService.sendHtmlMailMessage(mail.getEmail(), mail.getSubject(), mail.getContent());
            }
        }catch (Exception e){
            System.out.println(e.getMessage());
        }finally {
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        }
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = MqConst.QUEUE_FORGET_PASSWORD, durable = "true"),
            exchange = @Exchange(value = MqConst.EXCHANGE_PASSWORD_DIRECT),
            key = {MqConst.ROUTING_FORGET_PASSWORD}
    ))
    public void forgetPassword(Email mail, Message message, Channel channel) throws IOException {
        try{
        if (StringUtils.hasText(mail.getEmail())){
            mailService.sendTextMailMessage(mail.getEmail(), mail.getSubject(), mail.getContent());
        }
        }catch (Exception e){
            System.out.println(e.getMessage());
        }finally {
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        }
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = MqConst.QUEUE_REGISTER_SUCCESS, durable = "true"),
            exchange = @Exchange(value = MqConst.EXCHANGE_REGISTER_DIRECT),
            key = {MqConst.ROUTING_REGISTER_SUCCESS}
    ))
    public void registerSuccess(Map<String,String> usermap , Message message, Channel channel) throws IOException {
        String uuid = usermap.get("uuid");
        String email = usermap.get("email");
        try {
            if (uuid != null) {
                userService.sendEmailForRegisterSuccess(uuid, email);
            }
        }catch (Exception e){
            System.out.println(e.getMessage());
        }finally {
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        }
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = MqConst.QUEUE_BOOK_DEMO, durable = "true"),
            exchange = @Exchange(value = MqConst.EXCHANGE_BOOK_DIRECT),
            key = {MqConst.ROUTING_BOOK_DEMO}
    ))
    public void bookDemo(Book book, Message message, Channel channel) throws IOException {
        try {
            if (book != null) {
                bookService.emailNotify(book);
            }
        }catch (Exception e){
            System.out.println(e.getMessage());
        }finally {
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        }

    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = MqConst.QUEUE_BIND_SENDER, durable = "true"),
            exchange = @Exchange(value = MqConst.EXCHANGE_SENDER_DIRECT),
            key = {MqConst.ROUTING_BIND_SENDER}
    ))
    public void bindSender(Email mail, Message message, Channel channel) throws IOException {
        try {
            if (StringUtils.hasText(mail.getEmail())) {
                mailService.sendTextMailMessage(mail.getEmail(), mail.getSubject(), mail.getContent());
            }
        }catch (Exception e){
            System.out.println(e.getMessage());
        }finally {
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        }
    }



}
