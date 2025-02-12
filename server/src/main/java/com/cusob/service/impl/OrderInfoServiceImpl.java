package com.cusob.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.constant.RedisConst;
import com.cusob.dto.OrderInfoDto;
import com.cusob.entity.OrderHistory;
import com.cusob.entity.OrderInfo;
import com.cusob.entity.PlanPrice;
import com.cusob.entity.Price;
import com.cusob.enums.PaypalPaymentIntent;
import com.cusob.enums.PaypalPaymentMethod;
import com.cusob.exception.CusobException;
import com.cusob.mapper.OrderInfoMapper;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.OrderInfoService;
import com.cusob.service.PriceService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.concurrent.TimeUnit;

@Service
public class OrderInfoServiceImpl extends ServiceImpl<OrderInfoMapper, OrderInfo> implements OrderInfoService {

    @Autowired
    private PriceService priceService;

    @Autowired
    private PayPalService payPalService;

    @Autowired
    private RedisTemplate redisTemplate;

    @Value("${cusob.url}")
    private String baseUrl;

    /**
     * save Order Information
     * @param orderInfoDto
     * @param planId
     */
    @Override
    public void saveOrderInfo(OrderInfoDto orderInfoDto, Long planId) {
        this.paramVerify(orderInfoDto);
        OrderInfo orderInfo = new OrderInfo();
        BeanUtils.copyProperties(orderInfoDto, orderInfo);
        Long userId = AuthContext.getUserId();
        orderInfo.setUserId(userId);
        Price plan = priceService.getById(planId);
        orderInfo.setPaymentStatus(OrderInfo.UNPAID);
        orderInfo.setPlanId(planId);
        orderInfo.setPlanName(plan.getName());
        orderInfo.setContactCapacity(plan.getContactCapacity());
        orderInfo.setEmailCapacity(plan.getEmailCapacity());
        orderInfo.setPrice(plan.getPriceUSD());
        orderInfo.setDiscounts(new BigDecimal(0)); // todo 待修改
        orderInfo.setTax(new BigDecimal(0));
        orderInfo.setTotalAmount(plan.getAmountUSD());
        baseMapper.insert(orderInfo);

        OrderHistory orderHistory = new OrderHistory();
        BeanUtils.copyProperties(orderInfo, orderHistory);
        orderHistory.setOrderId(orderInfo.getId());
        orderHistory.setCompanyId(AuthContext.getCompanyId());
        String key = RedisConst.ORDER_PREFIX + userId;
        redisTemplate.opsForValue().set(key, orderHistory, RedisConst.ORDER_TIMEOUT, TimeUnit.MINUTES);
    }

    /**
     * update Order Status
     * @param id
     * @param status
     */
    @Override
    public void updateOrderStatus(Long id, Integer status) {
        OrderInfo orderInfo = baseMapper.selectById(id);
        orderInfo.setPaymentStatus(status);
        baseMapper.updateById(orderInfo);
    }

    /**
     * Order Payment
     * @param planId
     */
    @Override
    public String pay(Long planId) {
        String cancelUrl = baseUrl + "/pricing?type=cancelPay";
        String successUrl = baseUrl + "/dashboard";
        Price plan = priceService.getById(planId);
        BigDecimal price = plan.getAmountUSD();
        String currency = PlanPrice.USD;
        String desc = plan.getName() + "\n" + "Contacts: " +
                plan.getContactCapacity() + " Sends: " +
                plan.getEmailCapacity();
        try {
            System.out.println("支付开始lalalallalal");
            //调用交易方法
            Payment payment = payPalService.createPayment(
                    price,
                    currency,
                    PaypalPaymentMethod.paypal,
                    PaypalPaymentIntent.sale,
                    desc,
                    cancelUrl,
                    successUrl);
            for(Links links : payment.getLinks()){
                if(links.getRel().equals("approval_url")){
                    return links.getHref();
                }
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
            throw new CusobException(ResultCodeEnum.ORDER_PAYMENT_ABNORMAL);
        }
        return null;
    }

    private void paramVerify(OrderInfoDto orderInfoDto) {
        if (orderInfoDto.getPaymentMethod() == null){
            throw new CusobException(ResultCodeEnum.PAYMENT_METHOD_ERROR);
        }
//        if (!StringUtils.hasText(orderInfoDto.getAccountFirstName())){
//            throw new CusobException(ResultCodeEnum.FIRST_NAME_IS_EMPTY);
//        }
//        if (!StringUtils.hasText(orderInfoDto.getAccountLastName())){
//            throw new CusobException(ResultCodeEnum.LAST_NAME_IS_EMPTY);
//        }
//        if (!StringUtils.hasText(orderInfoDto.getAccountAddressLine1())){
//            throw new CusobException(ResultCodeEnum.ADDRESS_IS_EMPTY);
//        }
        // TODO 其他参数校验
    }
}
