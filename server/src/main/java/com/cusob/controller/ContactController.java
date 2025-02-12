package com.cusob.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cusob.auth.AuthContext;
import com.cusob.constant.RedisConst;
import com.cusob.dto.ContactDto;
import com.cusob.dto.ContactQueryDto;
import com.cusob.entity.Contact;
import com.cusob.entity.Minio;
import com.cusob.result.Result;
import com.cusob.service.ContactService;
import com.cusob.service.MinioService;
import com.cusob.utils.ClientRedis;
import com.cusob.vo.ContactImportVo;
import com.cusob.vo.ContactVo;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundZSetOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.concurrent.TimeUnit;

@RequestMapping("/contact")
@RestController
public class ContactController {

    @Autowired
    private Minio minio;
    @Autowired
    private MinioService minioService;
    @Autowired
    private ContactService contactService;
    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private ClientRedis clientRedis;
    @ApiOperation("add Contact")
    @PostMapping("add")
    public Result addContact(@RequestBody ContactDto contactDto){
        contactService.addContact(contactDto);
        cleanCache("contact_*");
        return Result.ok();
    }
    @PostMapping("/parseFields")
    public Result<Map<String, Object>> parseFields(@RequestParam("file") MultipartFile file) {
        Map<String, Object> stringObjectMap = contactService.parseFields(file);
        return Result.ok(stringObjectMap);
    }

    @ApiOperation("get contact count by group")
    @GetMapping("getCountByGroup/{groupId}")
    public Result getCountByGroup(@PathVariable Long groupId){
        int count = contactService.getCountByGroup(groupId);
        return Result.ok(count);
    }

    @ApiOperation("get contact information By Id")
    @GetMapping("getById/{contactId}")
    public Result getById(@PathVariable Long contactId){
        ContactDto contactDto = contactService.getContactById(contactId);
        return Result.ok(contactDto);
    }

    @ApiOperation("batch remove contacts")
    @DeleteMapping("batchRemove")
    public Result batchRemove(@RequestBody List<Long> idList){
        contactService.batchRemove(idList);
        cleanCache("contact_*");
        return Result.ok();
    }

    @ApiOperation("update Contact")
    @PostMapping("update")
    public Result updateContact(@RequestBody ContactDto contactDto){
        contactService.updateContact(contactDto);
        cleanCache("contact_*");
        return Result.ok();
    }

    @ApiOperation("Contact List Pagination condition query")
    @GetMapping("getList/{page}/{limit}")
    public Result getContactList(@PathVariable Long page,
                                 @PathVariable Long limit,
                                 ContactQueryDto contactQueryDto){
        String rekey = "contact_list_" + page + "_" + limit + "_" + contactQueryDto.hashCode();
        String countKey=rekey+"_totalCount";
        BoundZSetOperations<String, Object> boundZSetOps = redisTemplate.boundZSetOps(rekey);
        Integer totalCount = (Integer) redisTemplate.opsForValue().get(countKey);
        if (totalCount == null || totalCount == 0)
        {
            Page<Contact> pageParam = new Page<>(page, limit);
            IPage<ContactVo> contactVoPage = contactService.getContactList(pageParam, contactQueryDto);
            totalCount = (int) contactVoPage.getTotal();
            // 将查询结果缓存到Redis中，并设置过期时间
            redisTemplate.opsForValue().set(countKey,totalCount);
            List<ContactVo> EventsList = contactVoPage.getRecords();
            for (int i = 0; i < EventsList.size(); i++)
            {
                boundZSetOps.add(EventsList.get(i), i);
            }
//            设置两个key的过期时间
            redisTemplate.expire(rekey, 5, TimeUnit.MINUTES);
            redisTemplate.expire(countKey, 5, TimeUnit.MINUTES);
            return Result.ok(contactVoPage);
        }
        else
        {
            Set<Object> eventSet = boundZSetOps.range(0, limit);
            List<Object> eventsList = new ArrayList<>(eventSet.size());
            for (Object event1 : eventSet)
            {
                eventsList.add((Object) event1);
            }
            return Result.ok(new Page(page, limit, totalCount).setRecords(eventsList));
        }

    }

    @ApiOperation("upload Avatar")
    @PostMapping("uploadAvatar")
    public Result uploadAvatar(@RequestPart("file") MultipartFile file){
        String url = minioService.uploadAvatar(minio.getBucketName(), file);
        return Result.ok(url);
    }

    @ApiOperation("batch import contacts")
    @PostMapping("batchImport")
    public Result batchImport(@RequestPart("file") MultipartFile file, String groupName,String subscriptionType){
        contactService.batchImport(file, groupName,subscriptionType);
        cleanCache("contact_*"); // 清除相关缓存
        return Result.ok();
    }

    @ApiOperation("batch import contacts Result")
    @GetMapping("batchImportResult")
    public Result batchImportResult(){
        Long userId = AuthContext.getUserId();
        ContactImportVo contactImportVo = clientRedis.queryRedis(RedisConst.GET_CONTACT_IMPORT_SUCESS, userId, ContactImportVo.class);
        return Result.ok(contactImportVo);
    }

    @ApiOperation("get All Contacts email By GroupId")
    @GetMapping("getAll/{groupId}")
    public Result getAllContactsByGroupId(@PathVariable Long groupId){
        String key ="group_"+groupId;
        List<String> emailList = contactService.getAllContactsByGroupId(groupId);
        return Result.ok(emailList);
    }

    private void cleanCache(String pattern){
        Set keys = redisTemplate.keys(pattern);
        redisTemplate.delete(keys);
    }

}
