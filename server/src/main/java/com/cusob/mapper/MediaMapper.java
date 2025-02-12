package com.cusob.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cusob.entity.Media;
import com.cusob.vo.MediaVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Date;

@Mapper
public interface MediaMapper extends BaseMapper<Media> {

    /**
     * 分页条件查询
     * @param pageParam
     * @return
     */
    IPage<MediaVo> pageQueryByUserId(Page<Media> pageParam,
                             @Param("userId") Long userId,
                             @Param("type") String type,
                             @Param("keyword") String keyword
                             );

    IPage<MediaVo> pageQueryByCompanyId(Page<Media> pageParam,
                                        @Param("companyId") Long companyId,
                                        @Param("type") String type,
                                        @Param("keyword") String keyword);
}
