package com.cusob.service;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cusob.dto.ContactDto;
import com.cusob.dto.ContactQueryDto;
import com.cusob.entity.Contact;
import com.cusob.vo.ContactVo;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public interface ContactService extends IService<Contact> {

    /**
     * add Contact
     * @param contactDto
     */
    void addContact(ContactDto contactDto);

    void updateByEmail(String email,Long groupId,Long userId, int valid);

    /**
     * get contact count by group
     * @param groupId
     * @return
     */
    int getCountByGroup(Long groupId);

    /**
     * get contact information By Id
     * @param contactId
     * @return
     */
    ContactDto getContactById(Long contactId);

    /**
     * batch remove contacts
     * @param idList
     */
    void batchRemove(List<Long> idList);

    /**
     * update Contact
     * @param contactDto
     */
    void updateContact(ContactDto contactDto);


    /**
     * Contact List Pagination condition query
     * @param contactQueryDto
     * @return
     */
    IPage<ContactVo> getContactList(Page<Contact> pageParam, ContactQueryDto contactQueryDto);

    /**
     * batch import contacts
     * @param file
     */
    void batchImport(MultipartFile file, String groupName,String subscriptionType);

    /**
     * get Contact Count By Group id
     * @param groupId
     * @return
     */
    Integer getContactCountByGroup(Long groupId);

    /**
     * get Count By User id
     * @return
     */
    Integer getCountByUserId();

    /**
     * get contact List By Group id
     * @param groupId
     * @return
     */
    List<Contact> getListByGroupId(Long groupId);

    /**
     * select Contact Count By CompanyId
     * @param companyId
     * @return
     */
    Integer selectCountByCompanyId(Long companyId);

    /**
     * get List By UserId And GroupId
     * @param userId
     * @param groupId
     * @return
     */
    List<Contact> getListByUserIdAndGroupId(Long userId, Long groupId);

    /**
     * get All Contacts email By GroupId
     * @param groupId
     * @return
     */
    List<String> getAllContactsByGroupId(Long groupId);

    List<Contact> getContactsByEmail(String email);

    void saveUnsubsribedEmail(String email);

    Map<String, Object> parseFields(MultipartFile file);

    boolean saveExcelImport(String groupName, ArrayList<Contact> contactArrayList, ArrayList<Contact> repeatImportList,ArrayList<Contact> finalImportList);
}
