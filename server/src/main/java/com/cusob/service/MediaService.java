package com.cusob.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.dto.MediaQueryDto;
import com.cusob.entity.Media;
import com.cusob.vo.MediaVo;

import java.util.List;

public interface MediaService extends IService<Media> {

    /**
     * get Media By Id
     * @param mediaId
     */
    Media getMediaById(Long mediaId);

    /**
     * batch Remove medias
     * @param idList
     */
    void batchRemove(List<Long> idList);

    /**
     * save Media
     * @param url
     */
    void saveMedia(String url);

    /**
     * Media List Pagination condition query
     * @param pageParam
     * @param mediaQueryDto
     * @return
     */
    IPage<MediaVo> getMediaList(Page<Media> pageParam, MediaQueryDto mediaQueryDto);
}
