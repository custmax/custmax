package com.cusob.service.impl;

import cn.hutool.crypto.SecureUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.entity.Dkim;
import com.cusob.exception.CusobException;
import com.cusob.mapper.DkimMapper;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.DkimService;
import com.cusob.service.MinioService;
import com.cusob.utils.DkimGeneratorUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.security.KeyPair;
import java.security.PublicKey;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class DkimServiceImpl extends ServiceImpl<DkimMapper, Dkim> implements DkimService {

    @Autowired
    private MinioService minioService;

    @Value("${minio.bucketDkim}")
    private String bucketDkim;

    @Value("${cusob.domain.dkim.prefix}")
    private String dkimPrefix;

    @Value("${cusob.domain.dkim.selector}")
    private String selectorPrefix;

    /**
     * get Dkim
     * @param domain
     * @return
     */
    @Override
    public Dkim getDkim(String domain) {
        Dkim dkim = baseMapper.selectOne(
                new LambdaQueryWrapper<Dkim>()
                        .eq(Dkim::getDomain, domain)
        );
        return dkim;
    }

    /**
     * get publicKey by domain
     * @param domain
     * @return
     */
    @Override
    public String getPublicKey(String domain) {
        Dkim dkim = baseMapper.selectOne(
                new LambdaQueryWrapper<Dkim>()
                        .eq(Dkim::getDomain, domain)
        );
        return dkim.getPublicKey();
    }

    /**
     * generate Dkim Key
     * @return
     */
    @Override
    public Map<String, String> generateKey(String domain) {
        Map<String, String> map = new HashMap<>();
        KeyPair keyPair = SecureUtil.generateKeyPair("RSA", 2048, null);
        PublicKey publicKey = keyPair.getPublic();
        // 将公钥和私钥写入到DER文件
        InputStream inputStream = new ByteArrayInputStream(keyPair.getPrivate().getEncoded());
//        Long userId = AuthContext.getUserId();
        String filePath = domain+ "/" +"privateKey.der";
        String url = minioService.uploadDkim(bucketDkim, filePath, inputStream);
        String encodedKey = Base64.getEncoder()
                .encodeToString(publicKey.getEncoded());
        map.put(Dkim.PUBLIC_KEY, encodedKey);
        map.put(Dkim.PRIVATE_KEY, url);
        return map;
    }

    /**
     * generate Dkim Key and save dkim
     * @param domain
     */
    @Override
    public void generateAndSaveDkim(String domain) {
        Dkim dkim = new Dkim();
        Map<String, String> map = this.generateKey(domain);
        String publicKey = map.get(Dkim.PUBLIC_KEY);
        dkim.setPublicKey(dkimPrefix + publicKey);
        dkim.setSelector(selectorPrefix);
        dkim.setDomain(domain);
        baseMapper.insert(dkim);
    }

}
