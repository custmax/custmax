package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.entity.Report;
import com.cusob.entity.User;
import com.cusob.mapper.ReportMapper;
import com.cusob.service.ReportService;
import com.cusob.service.UserService;
import com.cusob.vo.ReportVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportServiceImpl extends ServiceImpl<ReportMapper, Report> implements ReportService {

    @Autowired
    private UserService userService;

    /**
     * save Report
     */
    @Override
    public void saveReport(Report report) {
        baseMapper.insert(report);
    }

    /**
     * get Report Page
     * @param pageParam
     * @param keyword
     * @return
     */
    @Override
    public IPage<ReportVo> selectPage(Page<Report> pageParam, String keyword) {
        Long userId = AuthContext.getUserId();
        Long companyId = AuthContext.getCompanyId();
        User user = userService.getById(userId);
        IPage<ReportVo> page;
        if (user.getPermission().equals(User.USER)){
            // user
            page = baseMapper.pageQuery(pageParam, userId, keyword);
        }else {
            // admin
            page = baseMapper.pageQueryByCompanyId(pageParam, companyId, keyword);
        }
        return page;
    }

    @Override
    public void clicked(Long campaignId) {
        List<Report> reports = baseMapper.selectList(
                new LambdaQueryWrapper<Report>()
                        .eq(Report::getCampaignId, campaignId)
        );
        for(Report report : reports){
            report.setClicked(report.getClicked() + 1);
            baseMapper.updateById(report);
        }
    }

    /**
     * Read Count
     * @param campaignId
     */
    @Override
    public void opened(Long campaignId) {
        List<Report> reports = baseMapper.selectList(
                new LambdaQueryWrapper<Report>()
                        .eq(Report::getCampaignId, campaignId)
        );
        for(Report report : reports){
            report.setOpened(report.getOpened() + 1);
            baseMapper.updateById(report);
        }
    }

    /**
     * update DeliveredCount
     * @param campaignId
     */
    @Override
    public void updateDeliveredCount(Long campaignId) {
        List<Report> reports = baseMapper.selectList(
                new LambdaQueryWrapper<Report>()
                        .eq(Report::getCampaignId, campaignId)
        );
        for(Report report : reports){
            report.setDelivered(report.getDelivered() + 1);
            baseMapper.updateById(report);
        }
    }

    @Override
    public void updateHardBounceCount(Long campaignId) {
        Report report = baseMapper.selectOne(
                new LambdaQueryWrapper<Report>()
                        .eq(Report::getCampaignId, campaignId)
        );
        if (report!=null){
            report.setHardBounce(report.getHardBounce() + 1);
            baseMapper.updateById(report);
        }
    }

    @Override
    public void updateSoftBounceCount(Long campaignId) {
        Report report = baseMapper.selectOne(
                new LambdaQueryWrapper<Report>()
                        .eq(Report::getCampaignId, campaignId)
        );
        if (report!=null){
            report.setSoftBounce(report.getSoftBounce() + 1);
            baseMapper.updateById(report);
        }
    }

    @Override
    public void updateUnsubscribeCount(Long campaignId) {
        Report report = baseMapper.selectOne(
                new LambdaQueryWrapper<Report>()
                        .eq(Report::getCampaignId, campaignId)
        );
        if (report!=null){
            report.setUnsubscribe(report.getUnsubscribe() + 1);
            baseMapper.updateById(report);
        }
    }

    @Override
    public void removeReport(Long id) {
//        baseMapper.delete(
//                new LambdaQueryWrapper<Report>()
//                        .eq(Report::getId, id)
//        );
        baseMapper.deleteById(id);
    }

}
