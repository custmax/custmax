package com.cusob.service.impl;

import com.cusob.enums.PaypalPaymentIntent;
import com.cusob.enums.PaypalPaymentMethod;
import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PayPalService {

    //注入认证信息bean
    @Autowired
    private APIContext apiContext;

    /**
     * 支付方法
     * @param total 交易金额
     * @param currency 货币类型
     * @param method 枚举-作用
     * @param intent 枚举-意图
     * @param description 交易描述
     * @param cancelUrl 交易取消后跳转url
     * @param successUrl 交易成功后跳转url
     * @return
     * @throws PayPalRESTException
     */
    public Payment createPayment(
            BigDecimal total,
            String currency,
            PaypalPaymentMethod method,
            PaypalPaymentIntent intent,
            String description,
            String cancelUrl,
            String successUrl) throws PayPalRESTException {
        //设置金额和单位对象
        Amount amount = new Amount();
        amount.setCurrency(currency);
        amount.setTotal(total.toString());
        //设置具体的交易对象
        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);
        //交易集合-可以添加多个交易对象
        List<Transaction> transactions = new ArrayList<Transaction>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method.toString());

        Payment payment = new Payment();
        payment.setIntent(intent.toString());
        payment.setPayer(payer);
        payment.setTransactions(transactions);
        //设置反馈url
        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        //加入反馈对象
        payment.setRedirectUrls(redirectUrls);
        //加入认证并创建交易
        return payment.create(apiContext);

    }

    /**
     * 执行支付的方法(相当于提交事务)
     * @param paymentId 支付ID
     * @param payerId 支付人ID
     */
    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException{
        Payment payment = new Payment();
        payment.setId(paymentId);
        PaymentExecution paymentExecute = new PaymentExecution();
        paymentExecute.setPayerId(payerId);
        return payment.execute(apiContext, paymentExecute);
    }


}
