package com.cusob.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cusob.dto.MediaQueryDto;
import com.cusob.entity.Media;
import com.cusob.entity.Minio;
import com.cusob.result.Result;
import com.cusob.service.MediaService;
import com.cusob.service.MinioService;
import com.cusob.vo.MediaVo;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/media")
public class MediaController {

    @Autowired
    private Minio minio;

    @Autowired
    private MediaService mediaService;

    @Autowired
    private MinioService minioService;

    @ApiOperation("get Media By Id")
    @GetMapping("getById/{mediaId}")
    public Result getById(@PathVariable Long mediaId){
        Media media = mediaService.getMediaById(mediaId);
        return Result.ok(media);
    }

    @ApiOperation("batch Remove medias")
    @DeleteMapping("batchRemove")
    public Result batchRemove(@RequestBody List<Long> idList){
        mediaService.batchRemove(idList);
        return Result.ok();
    }

    @ApiOperation("Media List Pagination condition query")
    @GetMapping("getList/{page}/{limit}")
    public Result getMediaList(@PathVariable Long page,
                               @PathVariable Long limit,
                               MediaQueryDto mediaQueryDto){
        Page<Media> pageParam = new Page<>(page, limit);
        IPage<MediaVo> mediaVoPage = mediaService.getMediaList(pageParam, mediaQueryDto);
        return Result.ok(mediaVoPage);
    }

    @ApiOperation("upload media to minio")
    @PostMapping("/upload")
    public Result uploadFile(@RequestPart("file") MultipartFile file){
        String url = minioService.uploadFile(minio.getBucketName(), file);
        mediaService.saveMedia(url);
        return Result.ok(url);
    }
}
