package com.cusob.controller;

import cn.hutool.core.convert.impl.TimeZoneConverter;
import com.cusob.entity.Campaign;
import com.cusob.result.Result;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

@RestController
@RequestMapping("/date")
public class DateController {
    @ApiOperation("get date")
    @GetMapping("get/{timeZone}")
    public Result getDate(@PathVariable("timeZone") String timeZoneStr){
        Date now = new Date();
        //格式化
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        TimeZone timeZone = TimeZone.getTimeZone(timeZoneStr);
        sdf.setTimeZone(timeZone);
        String formattedTime = sdf.format(now);

        return Result.ok(formattedTime);
    }
    @ApiOperation("get all time zones")
    @GetMapping("getAllTimeZones")
    public Result getAllTimeZones(){
        TimeZoneConverter converter = new TimeZoneConverter();
        // 当前时间
        Date now = new Date();
        // 将当前时间转换为东八区 (UTC+8)
        Instant instant = now.toInstant();
        // 转换为指定时区的ZonedDateTime
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.of("UTC+8"));
        Date nowDate = Date.from(zonedDateTime.toInstant());
        System.out.println("东八区时间: " + nowDate);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String formattedTime = sdf.format(now);
        System.out.println("东八区时间: " + formattedTime);
        return Result.ok(nowDate);
    }
}
