package com.cusob.config;

import com.cusob.entity.Minio;
import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    @Autowired
    private Minio minio;

    @Bean
    public MinioClient minioClient(){
        return MinioClient.builder()
                .endpoint(minio.getUrl())
                //传入用户名和密码
                .credentials(minio.getUsername(), minio.getPassword())
                .build();
    }
}
