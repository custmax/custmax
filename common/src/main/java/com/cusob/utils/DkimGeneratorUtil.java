package com.cusob.utils;

import cn.hutool.core.io.FileUtil;
import cn.hutool.crypto.SecureUtil;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.jcajce.JcaPEMWriter;

import java.io.*;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class DkimGeneratorUtil {

    public static final String PRIVATE_KEY = "privateKey";
    public static final String PUBLIC_KEY = "publicKey";

    public static Map<String, String> generateKey() throws IOException {
        Map<String, String> map = new HashMap<>();
        KeyPair keyPair = SecureUtil.generateKeyPair("RSA", 2048, null);
        PublicKey publicKey = keyPair.getPublic();
        // 将公钥和私钥写入到DER文件
        InputStream inputStream = new ByteArrayInputStream(keyPair.getPrivate().getEncoded());
//      FileUtil.writeBytes(keyPair.getPrivate().getEncoded(), "C:/Users/daybr/cusob/project/dkim/keys/hutool/private_key.der");
        String url = "https://test-daybreak.oss-cn-shanghai.aliyuncs.com/cusob/dkim/private_key.der";
        String encodedKey = Base64.getEncoder()
                .encodeToString(publicKey.getEncoded());
        map.put(PUBLIC_KEY, encodedKey);
        map.put(PRIVATE_KEY, url);
        return map;
    }

}
