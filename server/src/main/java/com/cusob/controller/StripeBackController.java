package com.cusob.controller;

import com.alibaba.fastjson.JSONObject;
import com.cusob.auth.AuthContext;
import com.cusob.constant.RedisConst;
import com.cusob.dto.OrderInfoDto;
import com.cusob.entity.OrderHistory;
import com.cusob.entity.OrderInfo;
import com.cusob.entity.Price;
import com.cusob.exception.CusobException;
import com.cusob.result.Result;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.OrderHistoryService;
import com.cusob.service.OrderInfoService;
import com.cusob.service.PriceService;
import com.google.gson.JsonSyntaxException;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.cusob.service.CompanyService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;


/**
 *  stripe 回调controller
 *  需要注意避坑
 *
 *  这里我用的是 checkout api进行拉起支付的，所以stripe官网也只会回调checkou.xxx ，不会走payment_intent.xxx
 *  也就是event事件回调通知
 *
 *
 *
 *                 PaymentIntent intent = (PaymentIntent) event
 *                     .getDataObjectDeserializer()
 *                     .getObject()
 *                     .get();
 *                 case "payment_intent.created"://创建订单 这里事件就是图二选着的事件
 *                     System.out.println("---------------nnnnnnnnnnnnnnnnnnnnnn---------------");
 *                     break;
 *                 case "payment_intent.canceled"://取消订单
 *                     System.out.println("---------------canceledcanceledcanceledcanceledcanceledcanceled---------------");
 *                     break;
 *                 case "payment_intent.succeeded"://支付成功
 *                     if(intent.getStatus().equals("succeeded")) {
 *                         System.out.println("---------------success---------------");
 *                         Map<String,String> metaData = intent.getMetadata();//自定义传入的参数
 *                         String orderId = metaData.get("orderId");//自定义订单号
 *                         System.out.println(orderId);
 *                         *//*********** 根据订单号从数据库中找到订单，并将状态置为成功 *********//*
 *                     }
 *                     break;
 *                 case "payment_intent.payment_failed"://支付失败
 *                     System.out.println("Failed: " + intent.getId());
 *                     System.out.println("---------------payment_failed---------------");
 *                     break;
 *
 */



@Slf4j
@Controller
public class StripeBackController {
    @Value("${stripe.webhookSecret}")
    private String webhookSecret;
    @Autowired
    private CompanyService companyService;
    @Autowired
    private OrderInfoService orderInfoService;

    @Autowired
    private OrderHistoryService orderHistoryService;

    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private PriceService priceService;

    @ResponseBody
    @RequestMapping(value = {"/pay/stripe/stripe_events"}, method = RequestMethod.POST)
    public Result stripe_events(HttpServletRequest request, HttpServletResponse response) {
        System.out.println("request:"+request);
        System.out.println("------进入回调了------");
        InputStream inputStream = null;
        ByteArrayOutputStream output = null;
        try {
            inputStream = request.getInputStream();
            output = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024*4];
            int n;
            while (-1 != (n = inputStream.read(buffer))) {
                output.write(buffer, 0, n);
            }
            byte[] bytes = output.toByteArray();
            String eventPayload = new String(bytes, "UTF-8");
            System.out.println("获取请求体的参数：" + eventPayload);
            System.out.println("获取请求头" + request);
            //获取请求头签名
            String sigHeader = request.getHeader("Stripe-Signature");
            System.out.println("获取请求头的签名：" + sigHeader);
            Event event=null;
            try {
                event = Webhook.constructEvent(eventPayload,sigHeader,webhookSecret);  //调用webhook进行验签
            } catch (JsonSyntaxException e) {
                log.error("参数格式有误，解析失败：",e);
                response.setStatus(400);
            }catch (SignatureVerificationException e) {
                log.error("参数被篡改，验签失败：",e);
                response.setStatus(400);
            }
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            StripeObject stripeObject = null;
            if (dataObjectDeserializer.getObject().isPresent()) {
                stripeObject = dataObjectDeserializer.getObject().get();
            } else {
                log.error("Deserialization failed due to an API version mismatch.");
                System.out.println("Deserialization failed due to an API version mismatch.");
            }
            System.out.println("event.getType():"+event.getType());
            switch(event.getType()) {
                case "checkout.session.completed"://支付完成
                    System.out.println("---------------success2222222---------------");
                    System.out.println();
                    Session session = (Session) stripeObject;
                    System.out.println("session:"+session);
                    //从元数据中取回数据
                    Map<String, String> metadata = session.getMetadata();
                    String orderId = metadata.get("orderIds");
                    Long priceId = Long.valueOf(metadata.get("priceId"));
                    Long userId = Long.valueOf(metadata.get("userId"));
                    Long companyId = Long.valueOf(metadata.get("companyId"));
                    OrderHistory orderHistory = new OrderHistory();
                    orderHistory.setCompanyId(companyId);
                    orderHistory.setUserId(userId);
                    orderHistory.setPlanId(priceId);
                    orderHistory.setOrderId(Long.valueOf(orderId));
                    Price price = priceService.getPlanById(priceId);
                    orderHistory.setPlanName(price.getName());
                    orderHistory.setContactCapacity(price.getContactCapacity());
                    orderHistory.setEmailCapacity(price.getEmailCapacity());
                    orderHistory.setPrice(price.getPriceUSD());
                    orderHistory.setTotalAmount(price.getPriceUSD());
                    orderHistory.setPaymentMethod(OrderHistory.VISA);
                    orderHistory.setDiscounts(BigDecimal.valueOf(0.0));
                    orderHistory.setTax(BigDecimal.valueOf(0.0));
                    String key = RedisConst.ORDER_PREFIX + userId;
                    redisTemplate.opsForValue().set(key, orderHistory, RedisConst.ORDER_TIMEOUT, TimeUnit.MINUTES);
                    orderHistoryService.saveOrderHistory(orderHistory);
                    companyService.updatePlan(userId, priceId);
                    //redisTemplate.delete(key);
                    System.out.println("订单号为：" + orderId);
                    // 根据订单号从数据库中找到订单，并将状态置为支付成功状态
                    break;
                    // 根据订单号从数据库中找到订单，并将状态置为支付成功状态
                case "checkout.session.expired"://过期
                    System.out.println("---------------checkout.session.expired---------------");
                    break;
                case "payment_intent.created"://创建订单 这里事件就是图二选着的事件
                     System.out.println("---------------nnnnnnnnnnnnnnnnnnnnnn---------------");
                     break;
                case "payment_intent.canceled"://取消订单
                     System.out.println("---------------canceledcanceledcanceledcanceledcanceledcanceled---------------");
                     break;
                case "payment_intent.succeeded"://支付成功,发现只有这里才能传过来支付方式
                    PaymentIntent paymentIntent = (PaymentIntent) stripeObject;
                    log.info("PaymentIntent was successful!");
                    System.out.println("wwwwwwwww"+paymentIntent);
                 case "payment_intent.payment_failed"://支付失败
                     //System.out.println("Failed: " + intent.getId());
                     System.out.println("---------------payment_failed---------------");
                     break;

                default:
                    break;
            }
        } catch (Exception e) {
            System.out.println("stripe异步通知（webhook事件）"+e);
        }
        return Result.ok();
    }
}