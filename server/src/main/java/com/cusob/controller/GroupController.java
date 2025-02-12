package com.cusob.controller;

import com.cusob.dto.GroupDto;
import com.cusob.entity.Group;
import com.cusob.result.Result;
import com.cusob.service.GroupService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/group")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @ApiOperation("add Group")
    @PostMapping("add")
    public Result addGroup(@RequestBody GroupDto groupDto){
        groupService.addGroup(groupDto);
        return Result.ok();
    }

    @ApiOperation("get Group By Id")
    @GetMapping("getById/{groupId}")
    public Result getGroupById(@PathVariable Long groupId){
        Group group = groupService.getGroupById(groupId);
        return Result.ok(group);
    }

    @ApiOperation("get Group List")
    @GetMapping("getList")
    public Result getGroupList(){
        List<Group> groupList = groupService.getGroupList();
        return Result.ok(groupList);
    }

    @ApiOperation("get Groups And Contact Count")
    @GetMapping("getGroupsAndContactCount")
    public Result getGroupsAndContactCount(){
        Map<String, Integer> map = groupService.getGroupsAndContactCount();
        return Result.ok(map);
    }

    @ApiOperation("update Group")
    @PostMapping("update")
    public Result updateGroup(@RequestBody GroupDto groupDto){
        groupService.updateGroup(groupDto);
        return Result.ok();
    }

    @ApiOperation("remove Group By Id")
    @DeleteMapping("remove/{groupId}")
    public Result removeGroupById(@PathVariable Long groupId){
        groupService.removeGroupById(groupId);
        return Result.ok();
    }

    @ApiOperation("get Group By Name")
    @GetMapping("getByName/{groupName}")
    public Result getGroupByName(@PathVariable String groupName){
        Group group = groupService.getGroupByName(groupName);
        return Result.ok(group);
    }

}
