package com.cusob.utils;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.cusob.entity.RedisData;
import com.cusob.exception.CusobException;
import com.cusob.result.ResultCodeEnum;
import com.github.xiaoymin.knife4j.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Slf4j
@Component
public class ClientRedis {
    @Autowired
    private final RedisTemplate<String, Object> redisTemplate;

    private static final ExecutorService CACHE_REBUILD_EXECUTOR = Executors.newFixedThreadPool(10);

    public ClientRedis(RedisTemplate<String, Object> redisTemplate, StringRedisTemplate stringRedisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    //设置存入Redis当中
    public void set(String key, Object value, Long expireTime, TimeUnit timeUnit) {
        String jsonStr = JSONUtil.toJsonStr(value);
        redisTemplate.opsForValue().set(key, jsonStr,expireTime,timeUnit);
    }
    //设置过期时间
    public void setLogicalExpireTime(String key, Object value,Long expireTime,TimeUnit timeUnit) {
        RedisData redisData = new RedisData();
        redisData.setData(value);
        redisData.setExpireTime(LocalDateTime.now().plusSeconds(timeUnit.toSeconds(expireTime)));
        redisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(redisData));
    }

    public <R,ID> R queryRedis(String keyPrefix, ID id, Class<R> type){
        String key = keyPrefix+id;
        Object o = redisTemplate.opsForValue().get(key);
        String jsonStr = JSONUtil.toJsonStr(o);
        R bean = JSONUtil.toBean(jsonStr, type);
        return bean;
    }
    //todo 列表尚未完成
    public <R,ID> R queryWithPassThrough(String keyPrefix, ID id, Class<R> type,
                                         Function<ID,R> idrFunction,
                                         Long expireTime,TimeUnit timeUnit) {
        String key = keyPrefix+id;
        Object o = redisTemplate.opsForValue().get(key);
        String jsonStr = JSONUtil.toJsonStr(o);
        if(StrUtil.isNotBlank(jsonStr)) {
            return JSONUtil.toBean(jsonStr,type);
        }
        if (jsonStr==null){
            return null;
        }
        R r = idrFunction.apply(id);
        if (r==null){
            redisTemplate.opsForValue().set(key,"",2,TimeUnit.MINUTES);
            return null;
        }
        redisTemplate.opsForValue().set(key,r.toString(),expireTime,timeUnit);
        return r;
    }
    //todo 列表尚未完成
    public <R,ID,Q> R queryWithLogicalExpire(String keyPrefix,ID id,Class<R> type,Q q,
                                           Function<Q,R> idrFunction,
                                           Long expireTime,TimeUnit timeUnit){
        String key = keyPrefix+id;
        Object json = redisTemplate.opsForValue().get(key);
        String jsonStr = JSONUtil.toJsonStr(json);
        if(StrUtil.isBlank(jsonStr)) {
            return null;
        }
        RedisData dataBean = JSONUtil.toBean(jsonStr, RedisData.class);
        String jsonStrObject = JSONUtil.toJsonStr(dataBean.getData());
        R r = JSONUtil.toBean(jsonStrObject, type);
        LocalDateTime ifExpireTime = dataBean.getExpireTime();
        if (ifExpireTime.isAfter(LocalDateTime.now())) {
            return r;
        }
        String lockKey = "LOCK_KEY" +id;
        boolean isLock = tryLock(lockKey);
        if (isLock){
            Object o = redisTemplate.opsForValue().get(key);
            JSONUtil.toJsonStr(o);
            if (StrUtil.isBlank(jsonStr)){
                return null;
            }
            CACHE_REBUILD_EXECUTOR.submit(()->{
                try {
                    R apply = idrFunction.apply(q);
                    this.setLogicalExpireTime(key,apply,expireTime,timeUnit);
                }catch (Exception e){
                    throw new CusobException(ResultCodeEnum.REDIS_IS_ERROR);
                }finally {
                    unlock(lockKey);
                }
            });

        }
        return r;
    }

    public boolean tryLock(String key){
        Boolean b = redisTemplate.opsForValue().setIfAbsent(key, "1", 1, TimeUnit.MINUTES);
        return BooleanUtil.isTrue(b);
    }
    public void unlock(String key){
        redisTemplate.delete(key);
    }
}
