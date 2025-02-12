package com.cusob.receiver;

import com.cusob.constant.MqConst;
import com.cusob.service.DkimService;
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

@Component
public class DomainReceiver {

    @Autowired
    private DkimService dkimService;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = MqConst.QUEUE_GENERATE_DKIM, durable = "true"),
            exchange = @Exchange(value = MqConst.EXCHANGE_DKIM_DIRECT),
            key = {MqConst.ROUTING_GENERATE_DKIM}
    ))
    public void generateDkim(String domain, Message message, Channel channel) throws IOException {
        if (StringUtils.hasText(domain)){
            dkimService.generateAndSaveDkim(domain);
        }
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
    }
}
