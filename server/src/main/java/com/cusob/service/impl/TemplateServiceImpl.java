package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.dto.TemplateDto;
import com.cusob.dto.TemplateMoveFolderDto;
import com.cusob.dto.TemplateQueryDto;
import com.cusob.dto.TemplateRenameDto;
import com.cusob.entity.Company;
import com.cusob.entity.PlanPrice;
import com.cusob.entity.Template;
import com.cusob.exception.CusobException;
import com.cusob.mapper.TemplateMapper;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.CompanyService;
import com.cusob.service.TemplateService;
import com.cusob.utils.ClientRedis;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static com.cusob.constant.RedisConst.GET_TEMPLATE_PUBLIC;
import static com.cusob.constant.RedisConst.GET_TEMPLATE_PUBLIC_TIMEOUT;

@Service
public class TemplateServiceImpl extends ServiceImpl<TemplateMapper, Template> implements TemplateService {

    @Autowired
    private CompanyService companyService;
    @Autowired
    private TemplateService templateService;
    @Autowired
    private ClientRedis clientRedis;

    @Override
    public Map<String, List<Template>> getLastTwoWeeks() {
        Map<String, List<Template>> map = new HashMap<>();
        LocalDateTime localDateTime = LocalDateTime.now().minusWeeks(2);
        String dateString = localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date parse;
        try {
            parse = dateFormat.parse(dateString);
        } catch (ParseException e) {
            throw new CusobException(ResultCodeEnum.DATA_ERROR);
        }

        List<String> folderList = templateService.getPrivateFolderList();
        for (String folder : folderList) {
            LambdaQueryWrapper<Template> ge = new LambdaQueryWrapper<Template>()
                    .eq(Template::getUserId,AuthContext.getUserId())
                    .eq(Template::getFolder,folder)
                    .ge(Template::getUpdateTime, parse);
            List<Template> list = templateService.list(ge);
            map.put(folder,list);
        }
        return map;
    }

    @Override
    public void moveTemplateToFolder(TemplateMoveFolderDto templateMoveFolderDto) {
        if (templateMoveFolderDto == null) {
            throw new CusobException(ResultCodeEnum.FAIL);
        }
        String folderName = templateMoveFolderDto.getFolderName();
        List<Long> templateIds = templateMoveFolderDto.getTemplateIds();
        if (templateIds == null || templateIds.size() == 0) {
            throw new CusobException(ResultCodeEnum.FAIL);
        }
        templateIds.forEach(templateId -> {
            Template template = templateService.getById(templateId);
            template.setFolder(folderName);
            templateService.updateById(template);
        });

    }

    @Override
    public void deleteSelectTemplate(List<Long> templateIds) {
        templateIds.forEach(templateId -> {
            templateService.removeCustomizedTemplate(templateId);
        });
    }

    @Override
    public void renameTemplateFloder(TemplateRenameDto templateRenameDto) {
        if (templateRenameDto == null) {
            throw new CusobException(ResultCodeEnum.NAME_IS_EMPTY);
        }
        String name = templateRenameDto.getTemplateName();
        String newName = templateRenameDto.getNewTemplateName();
        List<Template> templateListByFolder = getTemplateListByFolder(name, "");
        List<Template> collect = templateListByFolder.stream().map(template -> {
            template.setFolder(newName);
            return template;
        }).collect(Collectors.toList());
        templateService.updateBatchById(collect);
    }

    /**
     * save customized Template
     *
     * @param templateDto
     */
    @Override
    public void saveCustomizedTemplate(TemplateDto templateDto) {
        this.paramVerify(templateDto);
        Template template = new Template();
        BeanUtils.copyProperties(templateDto, template);
        template.setIsCustomized(1);
        template.setUserId(AuthContext.getUserId());
        baseMapper.insert(template);
    }

    /**
     * get template by id
     *
     * @param id
     * @return
     */
    @Override
    public Template getTemplateById(Long id) {
        Template template = baseMapper.selectById(id);
        Integer isCustomized = template.getIsCustomized();
        Company company = companyService.getById(AuthContext.getCompanyId());
        if (company.getPlanId().equals(PlanPrice.FREE)) {
            if (isCustomized.equals(Template.SYSTEM)) {
                throw new CusobException(ResultCodeEnum.NO_PERMISSION);
            }
        }
        return template;
    }

    /**
     * update Template
     *
     * @param templateDto
     */
    @Override
    public void updateTemplate(TemplateDto templateDto) {
        Template templateSelect = baseMapper.selectById(templateDto.getId());
        if (templateSelect.getIsCustomized().equals(Template.SYSTEM)) {
            throw new CusobException(ResultCodeEnum.TEMPLATE_UPDATE_ERROR);
        }
        this.paramVerify(templateDto);
        Template template = new Template();
        BeanUtils.copyProperties(templateDto, template);
        template.setIsCustomized(1);
        template.setUserId(AuthContext.getUserId());
        baseMapper.updateById(template);
    }

    /**
     * get template List Group By Folder
     *
     * @param templateQueryDto
     * @return
     */
    @Override
    public Map<String, List<Template>> getListGroupByFolder(TemplateQueryDto templateQueryDto) {
        String keyword = templateQueryDto.getKeyword();
        String folder = templateQueryDto.getFolder();
        Map<String, List<Template>> map = new HashMap<>();
        List<String> folderList = this.getFolderList();
        boolean b = StringUtils.hasText(folder);
        if (b) {
            if (folder.equals("AdminPrivate")) {
                List<String> privateFolderList = templateService.getPrivateFolderList();
                for (String item : privateFolderList) {
                    List<Template> list = this.getTemplatePrivate(item);
                    if (list != null && list.size() > 0) {
                        map.put(item, list);
                    }
                }
                return map;
            }
            if (folder.equals("AdminPublic")) {
                List<String> publicFolderList = templateService.getPublicFolderList();
                for (String item : publicFolderList) {
                    List<Template> list = this.getTemplatePublic(item);
                    if (list != null && list.size() > 0) {
                        map.put(item, list);
                    }
                }
                return map;
            }

            if (!ifRename(folder)) {
                List<Template> list = this.getTemplatePublic(folder);
                if (list != null && list.size() > 0) {
                    map.put(folder, list);
                }
                return map;
            }
        }
        if (StringUtils.hasText(folder) || StringUtils.hasText(keyword)) {
            List<Template> list = this.getTemplateListByFolder(folder, keyword);
            map.put(folder, list);
            return map;
        }
        for (String item : folderList) {
            List<Template> list = this.getTemplateDefault(item);
            if (list != null && list.size() > 0) {
                map.put(item, list);
            }
        }
        return map;
    }

    /**
     * get Folder List
     *
     * @return
     */
    @Override
    public List<String> getFolderList() {
        List<String> privateFolderList = getPrivateFolderList();
        List<String> publicFolderList = getPublicFolderList();
        List<String> mergedList = new ArrayList<>(publicFolderList);
        if (privateFolderList!=null){
            mergedList.addAll(privateFolderList);
        }
        return mergedList;
    }

    @Override
    public List<String> getPrivateFolderList() {
        long user_id = AuthContext.getUserId();
        List<String> privateFolderList = baseMapper.getPrivateFolderList(user_id);
        if (privateFolderList == null || privateFolderList.size() <= 0) {
//            throw new CusobException(ResultCodeEnum.FOLDER_IS_EMPTY);
            return null;
        }
        return privateFolderList;
    }

    @Override
    public List<String> getPublicFolderList() {
        List<String> publicFolderList = baseMapper.getPublicFolderList();
        return publicFolderList;
    }


    /**
     * get Template List By Folder
     *
     * @param folder
     * @param keyword
     * @return
     */
    @Override
    public List<Template> getTemplateListByFolder(String folder, String keyword) {
        List<Template> templateList = baseMapper.selectList(
                new LambdaQueryWrapper<Template>()
                        .eq(Template::getUserId, AuthContext.getUserId())
                        .eq(Template::getFolder, folder)
                        .like(StringUtils.hasText(keyword), Template::getName, keyword)
        );
        return templateList;
    }


    @Override
    public List<Template> getTemplateDefault(String folder) {
        List<Template> originalList = baseMapper.selectList(
                new LambdaQueryWrapper<Template>()
                        .eq(Template::getUserId, AuthContext.getUserId())
                        .eq(Template::getFolder, folder)
        );
        if (!folder.equals("public")) {
            return originalList;
        }
        List<Template> customizedList = baseMapper.selectList(
                new LambdaQueryWrapper<Template>()
                        .eq(Template::getIsCustomized, 0)
        );
        // 合并两个列表
        List<Template> mergedList = new ArrayList<>(originalList);
        mergedList.addAll(customizedList);
        return mergedList;
    }

    @Override
    public List<Template> getTemplatePrivate(String folder) {
        List<Template> originalList = baseMapper.selectList(
                new LambdaQueryWrapper<Template>()
                        .eq(Template::getUserId, AuthContext.getUserId())
                        .eq(Template::getIsCustomized, 1)
                        .eq(Template::getFolder, folder)
        );
        return originalList;
    }

    @Override
    public List<Template> getTemplatePublic(String folder) {
        LambdaQueryWrapper<Template> eq = new LambdaQueryWrapper<Template>()
                .eq(Template::getIsCustomized, 0)
                .eq(Template::getFolder, folder);
        List<Template> originalList;
//        originalList = clientRedis.queryWithLogicalExpire(GET_TEMPLATE_PUBLIC,folder,List.class,eq
//                ,baseMapper::selectList,GET_TEMPLATE_PUBLIC_TIMEOUT, TimeUnit.MINUTES);
        originalList = baseMapper.selectList(eq);
//        clientRedis.setLogicalExpireTime(GET_TEMPLATE_PUBLIC+folder,originalList,GET_TEMPLATE_PUBLIC_TIMEOUT,TimeUnit.MINUTES);
        return originalList;
    }

    /**
     * remove Customized Template
     *
     * @param id
     */
    @Override
    public void removeCustomizedTemplate(Long id) {
        Template template = baseMapper.selectById(id);
        Integer isCustomized = template.getIsCustomized();
        if (isCustomized.equals(Template.SYSTEM)) {
            throw new CusobException(ResultCodeEnum.TEMPLATE_REMOVE_ERROR);
        }
        baseMapper.deleteById(id);
    }

    /***
     *
     * @param folder
     * @return 是否为系统模板
     */
    @Override
    public boolean ifRename(String folder) {
        LambdaQueryWrapper<Template> eq = new LambdaQueryWrapper<Template>()
                .eq(Template::getIsCustomized, 0)
                .eq(Template::getFolder, folder);
        int count = templateService.count(eq);
        if (count >0) {
            return false;
        }
        return true;
    }

    private void paramVerify(TemplateDto templateDto) {
        if (!StringUtils.hasText(templateDto.getName())) {
            throw new CusobException(ResultCodeEnum.TEMPLATE_NAME_EMPTY);
        }
        if (!StringUtils.hasText(templateDto.getSubject())) {
            throw new CusobException(ResultCodeEnum.TEMPLATE_SUBJECT_EMPTY);
        }
        if (!StringUtils.hasText(templateDto.getFolder())) {
            throw new CusobException(ResultCodeEnum.TEMPLATE_FOLDER_EMPTY);
        }
    }
}
