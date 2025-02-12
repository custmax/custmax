package com.cusob.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.dto.GroupDto;
import com.cusob.entity.Group;
import com.cusob.exception.CusobException;
import com.cusob.mapper.ContactMapper;
import com.cusob.mapper.GroupMapper;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.ContactService;
import com.cusob.service.GroupService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroupServiceImpl extends ServiceImpl<GroupMapper, Group> implements GroupService {

    @Autowired
    private ContactService contactService;

    /**
     * add Group
     * @param groupDto
     */
    @Override
    public Long addGroup(GroupDto groupDto) {
        String groupName = groupDto.getGroupName();
        // Group name is empty
        if (!StringUtils.hasText(groupName)){
            throw new CusobException(ResultCodeEnum.GROUP_NAME_EMPTY);
        }
        // the group name already exists todo
        Group groupSelect = this.getGroupByName(groupName);
        if (groupSelect != null){
            throw new CusobException(ResultCodeEnum.GROUP_NAME_ALREADY_EXISTS);
        }
        Group group = new Group();
        BeanUtils.copyProperties(groupDto, group);
        Long userId = AuthContext.getUserId();
        group.setUserId(userId);
        baseMapper.insert(group);
        return group.getId();
    }

    /**
     * get Group By Id
     * @param groupId
     * @return
     */
    @Override
    public Group getGroupById(Long groupId) {
        Group group = baseMapper.selectById(groupId);
        return group;
    }

    /**
     * get Group List
     * @return
     */
    @Override
    public List<Group> getGroupList() {
        Long userId = AuthContext.getUserId();
        List<Group> groupList = baseMapper.selectList(
                new LambdaQueryWrapper<Group>()
                        .eq(Group::getUserId, userId)
                        //.ne(Group::getIsDeleted, 0)
        );
        return groupList;
    }


    /**
     * update Group
     * @param groupDto
     */
    @Override
    public void updateGroup(GroupDto groupDto) {
        Group group = new Group();
        BeanUtils.copyProperties(groupDto, group);
        group.setUserId(AuthContext.getUserId());
        baseMapper.updateById(group);
    }

    /**
     * remove Group By Id
     * @param groupId
     */
    @Override
    public void removeGroupById(Long groupId) {
        // 判断当前组是否含有联系人
        int count = contactService.getCountByGroup(groupId);
        // 有，不能删除
        if (count > 0){
            throw new CusobException(ResultCodeEnum.GROUP_CONTAINS_CONTACTS);
        }
        // 无，可以删除
        baseMapper.deleteById(groupId);
    }

    /**
     * get Group By Name
     * @param groupName
     * @return
     */
    @Override
    public Group getGroupByName(String groupName) {
        Long userId = AuthContext.getUserId();
        Group group = baseMapper.selectOne(
                new LambdaQueryWrapper<Group>()
                        .eq(Group::getUserId, userId)
                        .eq(Group::getGroupName, groupName)
        );
        return group;
    }

    /**
     * get GroupId By groupName
     * @param groupName
     * @return
     */
    @Override
    public Long getGroupIdByName(String groupName) {
        if (!StringUtils.hasText(groupName)){
            throw new CusobException(ResultCodeEnum.GROUP_NAME_EMPTY);
        }
        Long groupId;
        Group group = this.getGroupByName(groupName);
        if (group==null){
            Group groupNew = new Group();
            groupNew.setGroupName(groupName);
            groupNew.setUserId(AuthContext.getUserId());
            baseMapper.insert(groupNew);
            groupId = groupNew.getId();
        }else {
            groupId = group.getId();
        }
        return groupId;
    }

    /**
     * get Groups And Contact Count
     * @return
     */
    @Override
    public Map<String, Integer> getGroupsAndContactCount() {
        List<Group> groupList = this.getGroupList();
        Map<String, Integer> map = new HashMap<>();
        for (Group group : groupList) {
            Integer count = contactService.getContactCountByGroup(group.getId());
            map.put(group.getGroupName(), count);
        }
        return map;
    }
}
