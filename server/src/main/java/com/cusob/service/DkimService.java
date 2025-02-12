package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.entity.Dkim;

import java.util.Map;

public interface DkimService extends IService<Dkim> {

    /**
     * get Dkim
     * @param domain
     * @return
     */
    Dkim getDkim(String domain);

    /**
     * get publicKey by domain
     * @param domain
     * @return
     */
    String getPublicKey(String domain);

    /**
     * generate Dkim Key
     * @return
     */
    Map<String, String> generateKey(String domain);

    /**
     * generate Dkim Key and save dkim
     * @param domain
     */
    void generateAndSaveDkim(String domain);
}
