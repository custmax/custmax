package com.cusob.service.impl;

import com.cusob.auth.AuthContext;
import com.cusob.entity.Minio;
import com.cusob.service.MinioService;
import io.minio.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class MinioServiceImpl implements MinioService {

    @Autowired
    private Minio minio;

    @Autowired
    private MinioClient minioClient;

    /**
     * upload File
     * @param bucketName
     * @param file
     * @return
     */
    @Override
    public String uploadFile(String bucketName, MultipartFile file) {
        try {
            // 判断桶是否存在
            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!bucketExists){
            // 如果不存在，就创建桶
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }
            // 本地时间，具体到年、月、日
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            // String uuid= UUID.randomUUID().toString(); todo 文件名覆盖
            Long userId = AuthContext.getUserId();
            String filename = userId.toString() + "/" + timestamp + "/" + file.getOriginalFilename();
            // 加一个/表示创建一个文件夹
            minioClient.putObject(PutObjectArgs.builder().
                    bucket(bucketName).
                    object(filename).
                    stream(file.getInputStream(), file.getSize(), -1).
                    contentType(file.getContentType()).build()); // 文件上传的类型，如果不指定，那么每次访问时都要先下载文件
            String url= minio.getUrl()+"/"+minio.getBucketName()+"/"+filename;
            return url;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("文件上传失败");
        }

    }

    /**
     * batch Remove files
     * @param urlList
     */
    @Override
    public void batchRemove(List<String> urlList) {
        for (String url : urlList) {
            String str = url.substring(StringUtils.ordinalIndexOf(url, "/", 3) + 1);
            String bucketName = str.substring(0, str.indexOf('/'));
            String fileName = str.substring(str.indexOf('/') + 1);
            try {
                // todo 待优化 批量删除minio中文件
                minioClient.removeObject(RemoveObjectArgs.builder()
                        .bucket(bucketName)
                        .object(fileName)
                        .build());
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException(url+"文件删除失败");
            }
        }
    }

    /**
     * upload Avatar
     * @param bucketName
     * @param file
     * @return
     */
    @Override
    public String uploadAvatar(String bucketName, MultipartFile file) {
        try {
            // 判断桶是否存在
            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!bucketExists){
                // 如果不存在，就创建桶
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }
             String uuid= UUID.randomUUID().toString();
            Long userId = AuthContext.getUserId();
            String filename = userId.toString() + "/avatar/" + uuid + file.getOriginalFilename();
            // 加一个/表示创建一个文件夹
            minioClient.putObject(PutObjectArgs.builder().
                    bucket(bucketName).
                    object(filename).
                    stream(file.getInputStream(), file.getSize(), -1).
                     contentType(file.getContentType()).build()); // 文件上传的类型，如果不指定，那么每次访问时都要先下载文件
            String url= minio.getUrl()+"/"+minio.getBucketName()+"/"+filename;
            return url;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("文件上传失败");
        }
    }

    /**
     *  upload Dkim secret key
     * @return
     */
    @Override
    public String uploadDkim(String bucketName, String filePath, InputStream inputStream) {
        try {
            // 判断桶是否存在
            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!bucketExists){
                // 如果不存在，就创建桶
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }

            // 加一个/表示创建一个文件夹
            minioClient.putObject(PutObjectArgs.builder().
                    bucket(bucketName).
                    object(filePath).
                    stream(inputStream, inputStream.available(), -1).
                    build());

            String url= minio.getUrl()+"/"+minio.getBucketName()+"/"+filePath;
            return url;
        }catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("文件上传失败");
        }
    }

}
