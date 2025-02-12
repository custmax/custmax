package com.cusob.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cusob.entity.Template;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface TemplateMapper extends BaseMapper<Template> {


    /**
     * get Folder List
     * @return
     */
    List<String> getFolderList();
    List<String> getPrivateFolderList(Long user_id);
    List<String> getPublicFolderList();
}
