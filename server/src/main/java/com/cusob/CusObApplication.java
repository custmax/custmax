package com.cusob;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement
@SpringBootApplication
@MapperScan("com.cusob.mapper")
public class CusObApplication {
    public static void main(String[] args) {
        SpringApplication.run(CusObApplication.class, args);
    }
}
