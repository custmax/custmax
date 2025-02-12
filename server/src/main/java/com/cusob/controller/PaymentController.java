package com.cusob.controller;

import com.cusob.auth.AuthContext;
import com.cusob.constant.RedisConst;
import com.cusob.entity.OrderHistory;
import com.cusob.entity.OrderInfo;
import com.cusob.enums.PaypalPaymentIntent;
import com.cusob.enums.PaypalPaymentMethod;
import com.cusob.exception.CusobException;
import com.cusob.result.Result;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.CompanyService;
import com.cusob.service.OrderHistoryService;
import com.cusob.service.OrderInfoService;
import com.cusob.service.impl.PayPalService;
import com.cusob.utils.UrlUtil;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PayPalService payPalService;

    @Autowired
    private OrderInfoService orderInfoService;

    @Autowired
    private OrderHistoryService orderHistoryService;

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private CompanyService companyService;

    /**
     * 交易取消
     * @return
     */
    @GetMapping("pay/cancel")
    public Result cancelPay(){
        String key = RedisConst.ORDER_PREFIX + AuthContext.getUserId();
        OrderHistory orderHistory = (OrderHistory) redisTemplate.opsForValue().get(key);
        if (orderHistory==null){
            throw new CusobException(ResultCodeEnum.ORDER_PAYMENT_ABNORMAL);
        }
        orderInfoService.updateOrderStatus(orderHistory.getOrderId(), OrderInfo.CANCEL);
        return Result.ok();
    }

    /**
     * 交易成功,并执行交易(相当于提交事务)
     * @param paymentId
     * @param payerId
     * @return
     */
    @Transactional
    @GetMapping("pay/success")
    public Result successPay(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId){
        try {
            System.out.println("支付开始");
            Payment payment = payPalService.executePayment(paymentId, payerId);
            if(payment.getState().equals("approved")){
                Long userId = AuthContext.getUserId();//从AuthContext中获取当前用户的ID。
                String key = RedisConst.ORDER_PREFIX + userId;//生成一个Redis的键，用于获取订单历史记录。
                OrderHistory orderHistory = (OrderHistory) redisTemplate.opsForValue().get(key);//从Redis缓存中获取订单历史记录。
                if (orderHistory==null){
                    throw new CusobException(ResultCodeEnum.ORDER_PAYMENT_ABNORMAL);
                }
                orderInfoService.updateOrderStatus(orderHistory.getOrderId(), OrderInfo.COMPLETED);
                orderHistoryService.saveOrderHistory(orderHistory);
                companyService.updatePlan(userId, orderHistory.getPlanId());
                redisTemplate.delete(key);
                return Result.ok();
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
            throw new CusobException(ResultCodeEnum.ORDER_PAYMENT_ABNORMAL);
        }
        return Result.fail(null);
    }


}
