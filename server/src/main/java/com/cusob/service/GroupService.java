package com.cusob.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.dto.GroupDto;
import com.cusob.entity.Group;

import java.util.List;
import java.util.Map;

public interface GroupService extends IService<Group> {

    /**
     * add Group
     * @param groupDto
     */
    Long addGroup(GroupDto groupDto);

    /**
     * get Group By Id
     * @param groupId
     * @return
     */
    Group getGroupById(Long groupId);

    /**
     * get Group List
     * @return
     */
    List<Group> getGroupList();

    /**
     * update Group
     * @param groupDto
     */
    void updateGroup(GroupDto groupDto);

    /**
     * remove Group By Id
     * @param groupId
     */
    void removeGroupById(Long groupId);

    /**
     * get Group By Name
     * @param groupName
     * @return
     */
    Group getGroupByName(String groupName);

    /**
     * get GroupId By groupName
     * @param groupName
     * @return
     */
    Long getGroupIdByName(String groupName);

    /**
     * get Groups And Contact Count
     * @return
     */
    Map<String, Integer> getGroupsAndContactCount();
}
