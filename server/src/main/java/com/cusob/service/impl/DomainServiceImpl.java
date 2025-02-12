package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.entity.Dkim;
import com.cusob.entity.Domain;
import com.cusob.exception.CusobException;
import com.cusob.mapper.DomainMapper;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.DkimService;
import com.cusob.service.DomainService;
import com.cusob.utils.DnsUtil;
import com.cusob.vo.DomainListVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DomainServiceImpl extends ServiceImpl<DomainMapper, Domain> implements DomainService {

    @Autowired
    private DkimService dkimService;

    @Value("${cusob.domain.spf}")
    private String spf;

    @Value("${cusob.domain.mx}")
    private String mx;

    @Value("${cusob.domain.dkim.selector}")
    private String selector;

    /**
     * domain Verify
     * @param domain
     * @return
     */
    @Override
    public Map<String, Boolean> domainVerify(String domain) {//对应前端的verify方法
        if (!StringUtils.hasText(domain)){
            throw new CusobException(ResultCodeEnum.DOMAIN_IS_EMPTY);
        }
        Domain domainSelect = this.getByDomain(domain);
        Map<String, Boolean> map = new HashMap<>();

        //验证四个状态
        Boolean flagSpf = this.spfVerify(domain);
        Boolean flagDkim = this.dkimVerify(domain,domainSelect.getDkimValue());
        Boolean flagMx = this.mxVerify(domain);
        Boolean flagDmarc = this.dmarcVerify(domain,domainSelect.getDmarcValue());
        map.put("spf", flagSpf);
        map.put("dkim", flagDkim);
        map.put("mx",flagMx);
        map.put("dmarc",flagDmarc);

        domainSelect.setSpfVerify(flagSpf ? 1 :0);
        domainSelect.setDkimVerify(flagDkim ? 1: 0);
        domainSelect.setMxVerify(flagMx ? 1: 0);
        domainSelect.setDmarcVerify(flagDmarc ? 1: 0);
        domainSelect.setStatus(flagSpf && flagDkim ? 1:0);//SPF和DKIM验证通过才算通过
        baseMapper.updateById(domainSelect);
        return map;
    }

    /**
     * get DomainList
     * @return
     */
    @Override
    public List<Domain> getDomainList() {
        Long userId = AuthContext.getUserId();
        List<Domain> domainList = baseMapper.selectList(
                new LambdaQueryWrapper<Domain>()
                        .eq(Domain::getUserId, userId)
        );
        return domainList;
    }

    /**
     * get Domain
     * @param domain
     */
    @Override
    public Domain getByDomain(String domain) {
        Domain domainSelect = baseMapper.selectOne(
                new LambdaQueryWrapper<Domain>()
                        .eq(Domain::getDomain, domain)

        );
        return domainSelect;
    }

    private Boolean dkimVerify(String domain,String dkim) {

        List<String> dkimList = DnsUtil.checkDkim(domain,selector);

        if (dkimList!=null && dkimList.contains(dkim)){
            return true;
        }

        return false;
    }

    private Boolean dmarcVerify(String domain,String dmarcValue) {
        List<String> dmarcList = DnsUtil.checkdmarc(domain);
        if (dmarcList!=null && dmarcList.contains(dmarcValue)){
            return true;
        }
        return false;
    }

    /**
     * spf verify
     * @return
     */
    private Boolean spfVerify(String domain) {
        List<String> spfList = DnsUtil.checkSpf(domain);
        if (spfList!=null && spfList.contains(spf)){
            return true;
        }
        return false;
    }

    private Boolean mxVerify(String domain) {
        List<String> mxList = DnsUtil.checkmx(domain);
        if (mxList!=null && mxList.contains(mx)){
            return true;
        }
        return false;
    }
}
