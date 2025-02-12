package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.constant.RedisConst;
import com.cusob.entity.OrderHistory;
import com.cusob.entity.User;
import com.cusob.mapper.OrderHistoryMapper;
import com.cusob.service.OrderHistoryService;
import com.cusob.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class OrderHistoryServiceImpl
        extends ServiceImpl<OrderHistoryMapper, OrderHistory>
        implements OrderHistoryService {

    @Autowired
    private UserService userService;

    @Autowired
    private RedisTemplate redisTemplate;
    /**
     * save Order History
     * @param orderHistory
     */
    @Override
    public void saveOrderHistory(OrderHistory orderHistory) {
        baseMapper.insert(orderHistory);
    }

    /**
     * get Order History Page
     * @param pageParam
     * @return
     */
    @Override
    public IPage<OrderHistory> getOrderHistoryPage(Page<OrderHistory> pageParam) {
        Long userId = AuthContext.getUserId();
        Long companyId = AuthContext.getCompanyId();
        User user = userService.getById(userId);
        IPage<OrderHistory> page;
        String key = RedisConst.ORDER_PREFIX + userId;
        List<OrderHistory> cachedOrderHistoryList = (List<OrderHistory>) redisTemplate.opsForValue().get(key);
        if (cachedOrderHistoryList != null) {
            // 如果缓存中有数据，手动构造分页对象并返回
            pageParam.setRecords(cachedOrderHistoryList);
            return pageParam;
        }
        // 先从Redis缓存中获取数据
//        ObjectMapper objectMapper = new ObjectMapper();
//        String cachedPageJson = (String) redisTemplate.opsForValue().get(key);
//        if (cachedPageJson != null) {
//            try {
//                // 将缓存的JSON字符串转换为IPage<OrderHistory>
//                page = objectMapper.readValue(cachedPageJson, new TypeReference<IPage<OrderHistory>>() {});
//                return page;
//            } catch (Exception e) {
//                e.printStackTrace();
//                // 如果反序列化失败，可以继续执行数据库查询逻辑
//            }
//        }
        if (user.getPermission().equals(User.USER)){
            // user
            page = baseMapper.selectPage(pageParam,
                    new LambdaQueryWrapper<OrderHistory>()
                            .eq(OrderHistory::getUserId, userId)
            );
        }else {
            // admin
            page = baseMapper.selectPage(pageParam,
                    new LambdaQueryWrapper<OrderHistory>()
                            .eq(OrderHistory::getCompanyId, companyId)
            );
        }
        redisTemplate.opsForValue().set(key, page.getRecords(), RedisConst.ORDER_TIMEOUT, TimeUnit.MINUTES);
        return page;
        // 将查询结果中的记录列表放入Redis缓存

    }
}
