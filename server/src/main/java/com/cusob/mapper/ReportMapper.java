package com.cusob.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cusob.entity.Report;
import com.cusob.vo.ReportVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReportMapper extends BaseMapper<Report> {

    /**
     * get Report Page
     * @return
     */
    IPage<ReportVo> pageQuery(Page<Report> pageParam,
                              @Param("userId") Long userId,
                              @Param("keyword") String keyword);

    /**
     * page Query By CompanyId
     * @param pageParam
     * @param companyId
     * @param keyword
     * @return
     */
    IPage<ReportVo> pageQueryByCompanyId(Page<Report> pageParam,
                                         @Param("companyId") Long companyId,
                                         @Param("keyword") String keyword);
}
