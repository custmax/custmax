package com.cusob.controller;

import com.cusob.auth.AuthContext;
import com.cusob.dto.OrderInfoDto;
import com.cusob.entity.PlanPrice;
import com.cusob.result.Result;
import com.cusob.service.*;
import com.cusob.service.impl.UserServiceImpl;
import com.cusob.vo.UserVo;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PriceListParams;
import com.stripe.param.PriceUpdateParams;
import com.stripe.param.checkout.SessionCreateParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@RestController
public class StripeController {

    @Value("${stripe.apiKey}")
    private String apiKey;
    @Value("${stripe.successUrl}")
    private String successUrl;
    @Value("${stripe.cancelUrl}")
    private String cancelUrl;
//    static {
//        // 管理平台里面的密钥  详情请看 demo-image/1.jpg ，图片地址链接： https://dashboard.stripe.com/test/apikeys
//        Stripe.apiKey = apiKey;
////        staticFiles.externalLocation( Paths.get("public").toAbsolutePath().toString());
//    }

    @Autowired
    private CompanyService companyService;
    @Autowired
    private OrderInfoService orderInfoService;

    @Autowired
    private OrderHistoryService orderHistoryService;

    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private UserService userService;

    @Autowired
    private PriceService priceService;

    @ApiOperation("payByStripe")
    @GetMapping("/payByStripe")
    public ResponseEntity<Map<String, String>> payttt(Long id) throws StripeException {
        Stripe.apiKey = apiKey;
        //System.out.println("222"+apiKey);
        com.cusob.entity.Price price1 = priceService.getById(id);
        //生成订单
        Long userId = AuthContext.getUserId();
        Long companyId=AuthContext.getCompanyId();
        System.out.println("userId:"+userId);
        //OrderInfoDto orderInfoDto=new OrderInfoDto(); // 这个是前端传过来的数据

        BigDecimal randMoney = price1.getPriceUSD();
        //BigDecimal randMoney = BigDecimal.valueOf(0.50);//测试付款时取消注销
        int amountInCents = randMoney.multiply(new BigDecimal(100)).intValue();

        // 创建产品
        Map<String, Object> params = new HashMap<>();
        params.put("name", price1.getName());
        Product product = Product.create(params);

        // 创建价格
//        Map<String, Object> recurring = new HashMap<>();
//        if(price1.getMonths()==1) {
//            recurring.put("interval", "month");
//        }else recurring.put("interval", "year");
        Map<String, Object> params2 = new HashMap<>();
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("priceId", price1.getId());
        params2.put("metadata", metadata);
        params2.put("unit_amount", amountInCents);
        params2.put("currency", "usd");
        //params2.put("recurring", recurring);
        params2.put("product", product.getId());
        Price price = Price.create(params2);

        Map<String, String> paymentIntentMetadata = new HashMap<>();
        paymentIntentMetadata.put("priceId", String.valueOf(price1.getId()));
        paymentIntentMetadata.put("orderId", UUID.randomUUID().toString());
        //在这里传递元数据
        Map<String, String> sessionMetadata = new HashMap<>();
        sessionMetadata.put("priceId", String.valueOf(price1.getId()));
        Random random = new Random();
// 生成一个随机的长整型数字
        long orderId = random.nextLong();
        sessionMetadata.put("orderIds", Long.toString(orderId));
        System.out.println(Long.toString(orderId));
        sessionMetadata.put("userId", String.valueOf(userId));
        sessionMetadata.put("companyId", String.valueOf(companyId));

        // 创建支付信息，得到 URL
        SessionCreateParams params4 = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.WECHAT_PAY)
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.ALIPAY)
                .putExtraParam("payment_method_options[wechat_pay][client]", "web")
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPrice(price.getId())
                                .build())
//                .setPaymentIntentData(
//                        SessionCreateParams.PaymentIntentData.builder()
//                                .putAllMetadata(paymentIntentMetadata)
//                                .build())
                .putAllMetadata(sessionMetadata)
                .putMetadata("priceId", String.valueOf(price1.getId()))
                .putMetadata("orderId", UUID.randomUUID().toString())
                .build();
        Session session = Session.create(params4);


        // 返回 JSON 格式的 URL
        Map<String, String> response = new HashMap<>();
        response.put("url", session.getUrl());
        //System.out.println("url:"+session.getUrl());
        //return ResponseEntity.ok(response);
        return ResponseEntity.ok(response);
    }
    @ApiOperation("pay")
    @GetMapping("/pay")
    public ResponseEntity<Map<String, String>> pay(Long id) throws StripeException {
        UserVo userVo= userService.getUserInfo();
        System.out.println("userVo:"+userVo);
        com.cusob.entity.Price price1 = priceService.getById(id);
        //生成订单
        Long userId = AuthContext.getUserId();
        System.out.println("userId:"+userId);
        //OrderInfoDto orderInfoDto=new OrderInfoDto(); // 这个是前端传过来的数据

//        BigDecimal randMoney = price1.getPriceUSD();
        BigDecimal randMoney = BigDecimal.valueOf(0.01);
        int amountInCents = randMoney.multiply(new BigDecimal(100)).intValue();

        // 创建产品
        Map<String, Object> params = new HashMap<>();
        params.put("name", price1.getName());
        Product product = Product.create(params);

        // 创建价格
        Map<String, Object> recurring = new HashMap<>();
        if(price1.getMonths()==1) {
            recurring.put("interval", "month");
        }else recurring.put("interval", "year");
        Map<String, Object> params2 = new HashMap<>();
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("priceId", price1.getId());
        params2.put("metadata", metadata);
        params2.put("unit_amount", amountInCents);
        params2.put("currency", "usd");
        params2.put("recurring", recurring);
        params2.put("product", product.getId());
        Price price = Price.create(params2);
        Map<String, String> paymentIntentMetadata = new HashMap<>();
        paymentIntentMetadata.put("priceId", String.valueOf(price1.getId()));
        paymentIntentMetadata.put("orderId", UUID.randomUUID().toString());
        Map<String, String> sessionMetadata = new HashMap<>();
        sessionMetadata.put("priceId", String.valueOf(price1.getId()));
        sessionMetadata.put("orderId", UUID.randomUUID().toString());
        sessionMetadata.put("userId", String.valueOf(userId));
        // 创建支付信息，得到 URL
        SessionCreateParams params4 = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPrice(price.getId())
                                .build())
                .putAllMetadata(sessionMetadata)
                .putMetadata("priceId", String.valueOf(price1.getId()))
                .putMetadata("orderId", UUID.randomUUID().toString())
                .build();
        Session session = Session.create(params4);


        // 返回 JSON 格式的 URL
        Map<String, String> response = new HashMap<>();
        response.put("url", session.getUrl());
        return ResponseEntity.ok(response);
    }


    @ApiOperation("pay2")
    @PostMapping("/pay2")
    public String pay2() throws StripeException {
        try {
            /*PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                            .setAmount(1000L) // 支付金额，以分为单位
                            .setCurrency("usd") // 支付货币类型
                    .setReceiptEmail("517861659@qq.com") //支付成功发送邮箱
                    .setDescription("描述~~~123456789")
                            .build();
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            System.out.println(paymentIntent.toString());*/

            Map<String, Object> params2 = new HashMap<>();
            params2.put("amount", 2000);
            params2.put("currency", "USD");
            params2.put("description", "描述ssss");
            params2.put("receipt_email", "517861659@qq.com");

            Map<String, Object> automaticPaymentMethods = new HashMap<>();
            automaticPaymentMethods.put("enabled", true);
            params2.put("automatic_payment_methods", automaticPaymentMethods);

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("orderId", "2222222222222222");
            params2.put("metadata", metadata);

            PaymentIntent paymentIntent2 = PaymentIntent.create(params2);
            System.out.println(paymentIntent2.toString());

            return paymentIntent2.getClientSecret();
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    /**
     *
     * @param request
     * @param response
     * @return
     * @throws StripeException
     */
    @ApiOperation("pay3")
    @PostMapping("/pay3")
    public String pay3( HttpServletRequest request, HttpServletResponse response) throws StripeException {
        try {
                String token = request.getParameter("token");// 支付卡号，测试卡号 的token
                // 创建 Charge 对象
                Map<String, Object> chargeParams = new HashMap<>();
                chargeParams.put("amount", 2000);
                chargeParams.put("currency", "usd");
                chargeParams.put("source", token);
                chargeParams.put("description", "描述..........................");

                RequestOptions requestOptions = RequestOptions.builder().setApiKey(Stripe.apiKey).build();

                // 发送 Charge 请求并获取响应
                Charge charge = Charge.create(chargeParams, requestOptions);

                System.out.println(charge);
                // 处理成功支付的响应
                if (charge.getPaid()) {
                    // TODO: 处理支付成功的逻辑
                    return charge.getReceiptUrl();
                } else {
                    // TODO: 处理支付失败的逻辑
                    return null;
                }
        }catch (Exception e){
            // TODO: 处理异常情况的逻辑
            e.printStackTrace();
        }
        return null;
    }

        /**
         *           基本上会用到的api
         * 创建产品
         * 修改产品
         * 创建产品的价格
         * 修改产品的价格（注意这里，修改产品的价格是去把价格存档，然后再新增一条价格数据）
         * 得到这个产品的价格列表
         * 创建支付信息 得到url
         * @return
         */
    public void aa() throws StripeException {
        int max=9000;
        int min=1000;
        Random random = new Random();
        int randMoney = random.nextInt(max)%(max-min+1) + min;
        System.out.println(randMoney);

        //创建产品 https://stripe.com/docs/api/products/create
        Map<String, Object> params = new HashMap<>();
        params.put("name", "Gold Special");
        Product product = Product.create(params);
        System.out.println(product.toString());

        //修改产品 https://stripe.com/docs/api/products/update
        Product product2 = Product.retrieve(product.getId());
        Map<String, Object> params2 = new HashMap<>();
        params2.put("name", product.getName()+randMoney);
        Product updatedProduct = product2.update(params2);
        System.out.println(updatedProduct.toString());

        //创建价格 https://stripe.com/docs/api/prices/create
        Map<String, Object> recurring = new HashMap<>();
        recurring.put("interval", "month");
        Map<String, Object> params3 = new HashMap<>();
        params3.put("unit_amount", randMoney);
        params3.put("currency", "usd");
        params3.put("recurring", recurring);
        params3.put("product", product.getId());
        Price price = Price.create(params3);
        System.out.println(price.toString());

        //修改价格 （新建price,老的价格不用,存档） https://stripe.com/docs/products-prices/manage-prices?dashboard-or-api=api#edit-price
        Price resource = Price.retrieve(price.getId());
        PriceUpdateParams params4 = PriceUpdateParams.builder().setLookupKey(price.getLookupKey()).setActive(false).build();
        Price price2 = resource.update(params4);
        System.out.println(price2);

        //重新创建价格 https://stripe.com/docs/api/prices/create
        int randMoney3 = random.nextInt(max)%(max-min+1) + min;
        System.out.println(randMoney3);
        Map<String, Object> recurring2 = new HashMap<>();
        recurring2.put("interval", "month");
        Map<String, Object> params5 = new HashMap<>();
        params5.put("unit_amount", randMoney3);
        params5.put("currency", "usd");
        params5.put("recurring", recurring2);
        params5.put("product", product.getId());
        Price price3 = Price.create(params5);
        System.out.println(price3.toString());

        //得到这个产品的价格列表
        PriceListParams params6 = PriceListParams.builder().setProduct(product.getId()).setActive(true).build();
        PriceCollection prices = Price.list(params6);
        System.out.println(prices.toString());

        //创建支付信息 得到url
        SessionCreateParams params7 =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                        .setSuccessUrl("http://127.0.0.1:8080/success")
                        .setCancelUrl( "http://127.0.0.1:8080/cancel")
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)// 购买数量
                                        .setPrice(price3.getId())// 购买价格
                                        .build())
                        .putMetadata("orderId",UUID.randomUUID().toString())//订单id 支付成功后，回调的时候拿到这个订单id,进行修改数据库状态
                        .build();
        Session session = Session.create(params7);
        System.out.println(session.toString());
        System.out.println("最后去支付的url:"+session.getUrl());
    }

    @RequestMapping("/success")
    public String success(){
        return "success";
    }

    @RequestMapping("/cancel")
    public String cancel(){
        return "cancel";
    }

}
