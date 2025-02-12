package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.dto.MediaQueryDto;
import com.cusob.entity.Media;
import com.cusob.entity.User;
import com.cusob.mapper.MediaMapper;
import com.cusob.service.MediaService;
import com.cusob.service.MinioService;
import com.cusob.service.UserService;
import com.cusob.vo.MediaVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MediaServiceImpl extends ServiceImpl<MediaMapper, Media> implements MediaService {

    @Autowired
    private MinioService minioService;

    @Autowired
    private UserService userService;

    /**
     * get Media By Id
     * @param mediaId
     */
    @Override
    public Media getMediaById(Long mediaId) {
        Media media = baseMapper.selectById(mediaId);
        return media;
    }

    /**
     * batch Remove medias
     * @param idList
     */
    @Override
    public void batchRemove(List<Long> idList) {
        List<Media> mediaList = baseMapper.selectBatchIds(idList);
        List<String> urlList = mediaList.stream().map(Media::getUrl).collect(Collectors.toList());
        minioService.batchRemove(urlList);
        baseMapper.deleteBatchIds(idList);

    }

    /**
     * save Media
     * @param url
     */
    @Override
    public void saveMedia(String url) {
        String fileName = url.substring(url.lastIndexOf('/') + 1);
        String type = fileName.substring(fileName.lastIndexOf('.') + 1);
        Media media = new Media();
        media.setFileName(fileName);
        media.setType(type);
        media.setUrl(url);
        media.setUserId(AuthContext.getUserId());
        media.setCompanyId(AuthContext.getCompanyId());
        baseMapper.insert(media);
    }

    /**
     * Media List Pagination condition query
     * @param pageParam
     * @param mediaQueryDto
     * @return
     */
    @Override
    public IPage<MediaVo> getMediaList(Page<Media> pageParam, MediaQueryDto mediaQueryDto) {
        String type = mediaQueryDto.getType();
        String keyword = mediaQueryDto.getKeyword();
        IPage<MediaVo> mediaVoPage;
        Long userId = AuthContext.getUserId();
        Long companyId = AuthContext.getCompanyId();
        User user = userService.getById(userId);
        if (user.getPermission().equals(User.USER)){
            // user
            mediaVoPage = baseMapper.pageQueryByUserId(pageParam, userId, type, keyword);
        }else {
            // admin
            mediaVoPage = baseMapper.pageQueryByCompanyId(pageParam, companyId, type, keyword);
        }
        return mediaVoPage;
    }


}
