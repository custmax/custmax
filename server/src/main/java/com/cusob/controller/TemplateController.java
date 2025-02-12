package com.cusob.controller;

import com.cusob.dto.TemplateDto;
import com.cusob.dto.TemplateMoveFolderDto;
import com.cusob.dto.TemplateQueryDto;
import com.cusob.dto.TemplateRenameDto;
import com.cusob.entity.Template;
import com.cusob.result.Result;
import com.cusob.service.TemplateService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/template")
public class TemplateController {

    @Autowired
    private TemplateService templateService;

    @ApiOperation("get LastTwoWeeks")
    @GetMapping("/getLastTwoWeeks")
    public Result getLastTwoWeeks(){
        Map<String, List<Template>> lastTwoWeeks = templateService.getLastTwoWeeks();
        return Result.ok(lastTwoWeeks);
    }

    @ApiOperation("Can it be renamed")
    @GetMapping("/ifRename/{name}")
    public Result ifRename(@PathVariable String name){
        boolean b = templateService.ifRename(name);
        if (b){
            return Result.ok();
        }
        return Result.fail("forbid");
    }

    @ApiOperation("Get Public Folder")
    @GetMapping("/getPublicFolder")
    public Result getPublicFolderList(){
        List<String> publicFolderList = templateService.getPublicFolderList();
        return Result.ok(publicFolderList);
    }

    @ApiOperation("Get Private Folder")
    @GetMapping("/getPrivateFolder")
    public Result getPrivateFolderList(){
        List<String> privateFolderList = templateService.getPrivateFolderList();
        if (privateFolderList==null){
            return Result.fail(privateFolderList);
        }
        return Result.ok(privateFolderList);
    }


    @ApiOperation("Move to Folder")
    @PostMapping("/moveToFolder")
    public Result moveToFolder(@RequestBody TemplateMoveFolderDto templateMoveFolderDto){
        System.out.println(templateMoveFolderDto);
        templateService.moveTemplateToFolder(templateMoveFolderDto);
        return Result.ok();
    }

    @ApiOperation("Delete Template list")
    @DeleteMapping("/batchRemove")
    public Result deleteTemplateList(@RequestBody List<Long> idlist) {
        templateService.deleteSelectTemplate(idlist);
        System.out.println(idlist);
        return Result.ok();
    }

    @ApiOperation("Rename Template Folder")
    @PostMapping("/rename")
    public Result renameTemplateFolder(@RequestBody TemplateRenameDto templateRenameDto){
        templateService.renameTemplateFloder(templateRenameDto);
        return Result.ok();
    }


    @ApiOperation("save customized Template")
    @PostMapping("save/customized")
    public Result saveCustomizedTemplate(@RequestBody TemplateDto templateDto){
        templateService.saveCustomizedTemplate(templateDto);
        return Result.ok();
    }

    @ApiOperation("get template by id")
    @GetMapping("get")
    public Result getTemplateById(Long id){
        Template template = templateService.getTemplateById(id);
        return Result.ok(template);
    }

    @ApiOperation("update Template")
    @PostMapping("update")
    public Result updateTemplate(@RequestBody TemplateDto templateDto){
        templateService.updateTemplate(templateDto);
        return Result.ok();
    }

    @ApiOperation("get template List Group By Folder")
    @GetMapping("getList")
    public Result getListGroupByFolder(TemplateQueryDto templateQueryDto){
        Map<String, List<Template>> map = templateService.getListGroupByFolder(templateQueryDto);
        return Result.ok(map);
    }

    @ApiOperation("get Folder List")
    @GetMapping("getFolderList")
    public Result getFolderList(){
        List<String> folderList = templateService.getFolderList();
        return Result.ok(folderList);
    }

    @ApiOperation("get Template List By Folder")
    @GetMapping("getTemplateListByFolder")
    public Result getTemplateListByFolder(String folder ,String keyword){
        List<Template> templateList = templateService.getTemplateListByFolder(folder, keyword);
        return Result.ok(templateList);
    }

    @ApiOperation("remove Customized Template")
    @DeleteMapping("remove/{id}")
    public Result removeCustomizedTemplate(@PathVariable Long id){
        templateService.removeCustomizedTemplate(id);
        return Result.ok();
    }

}
