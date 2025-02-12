package com.cusob.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cusob.entity.Campaign;
import com.cusob.vo.CampaignListVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CampaignMapper extends BaseMapper<Campaign> {

    /**
     * get Campaign Page
     * @return
     */
    IPage<CampaignListVo> getCampaignPage(Page<Campaign> pageParam,
                                          @Param("userId") Long userId,
                                          @Param("name") String name,
                                          @Param("status") Integer status,
                                          @Param("order") Integer order
    );

    Campaign getCampaignByname(String campaignName);

    Long getLastCampaignId();

}
