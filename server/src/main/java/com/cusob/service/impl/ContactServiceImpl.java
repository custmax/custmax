package com.cusob.service.impl;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.exception.ExcelDataConvertException;
import com.alibaba.excel.read.listener.ReadListener;
import com.alibaba.excel.util.ListUtils;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.auth.AuthContext;
import com.cusob.constant.MqConst;
import com.cusob.constant.RedisConst;
import com.cusob.dto.ContactDto;
import com.cusob.dto.ContactQueryDto;
import com.cusob.dto.GroupDto;
import com.cusob.entity.*;
import com.cusob.exception.CusobException;
import com.cusob.mapper.ContactMapper;
import com.cusob.result.ResultCodeEnum;
import com.cusob.service.*;
import com.cusob.utils.ClientRedis;
import com.cusob.vo.ContactImportVo;
import com.cusob.vo.ContactVo;
import com.github.xiaoymin.knife4j.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


@Slf4j
@Service
public class ContactServiceImpl extends ServiceImpl<ContactMapper, Contact> implements ContactService {

    @Autowired
    private GroupService groupService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private PriceService priceService;

    @Autowired
    private UserService userService;

    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Autowired
    private ClientRedis clientRedis;


    /**
     * add Contact
     *
     * @param contactDto
     */
    @Override
    @Transactional
    public void addContact(ContactDto contactDto) {
        // contacts count
        Long companyId = AuthContext.getCompanyId();//获取当前用户的公司id
        Integer count = this.selectCountByCompanyId(companyId);//获取当前公司的联系人数量
        Company company = companyService.getById(companyId);//获取当前公司
        Price plan = priceService.getPlanById(company.getPlanId());//获取当前公司的套餐
        if (count >= plan.getContactCapacity()) {
            throw new CusobException(ResultCodeEnum.CONTACT_NUMBER_FULL);//联系人数量已满
        }
        // 参数校验
        //this.paramVerify(contactDto);
        Contact contact = new Contact();//创建联系人对象

        String groupName = contactDto.getGroupName();//获取联系人的组名
        // The group name is not empty
        if (StringUtils.hasText(groupName)) {//如果组名不为空
            Group group = groupService.getGroupByName(groupName);//获取组名
            // The group doesn't exist，create group
            if (group == null) {//如果组名不存在
                GroupDto groupDto = new GroupDto();
                groupDto.setGroupName(groupName);
                Long groupId = groupService.addGroup(groupDto);//添加组
                contact.setGroupId(groupId);//设置组id
            } else {
                contact.setGroupId(group.getId());
            }
        }
        contact.setUserId(AuthContext.getUserId());//设置用户id
        BeanUtils.copyProperties(contactDto, contact);//将contactDto的属性拷贝到contact中
        try {
            rabbitTemplate.convertAndSend(MqConst.EXCHANGE_CHECK_DIRECT, // 发送消息到交换机
                    MqConst.ROUTING_CHECK_EMAIL, contact); // 验证该邮箱是否真实存在（充分条件）
        } catch (Exception e) {
            System.err.println("Failed to send message to RabbitMQ: " + e.getMessage());
            e.printStackTrace();
        }

        if (baseMapper.selectByEmail(contact.getEmail(), contact.getGroupId()) == null) {
            contact.setUserId(AuthContext.getUserId());
            contact.setCompanyId(AuthContext.getCompanyId());
            baseMapper.insert(contact);
        } else {
            throw new CusobException(ResultCodeEnum.CONTACT_IS_EXISTED);
        }

    }

    @Override
    public void updateByEmail(String email, Long groupId, Long userId, int valid) {
        List<Contact> contacts = baseMapper.selectList(new LambdaQueryWrapper<Contact>()//查询多条联系人
                .eq(Contact::getEmail, email).eq(Contact::getUserId, userId).eq(Contact::getGroupId, groupId));
        for (Contact contact : contacts) {
            contact.setValid(valid); //设置是否有效
            baseMapper.updateById(contact);
        }

    }

    private void paramVerify(ContactDto contactDto) {
        if (!StringUtils.hasText(contactDto.getFirstName())) {
            throw new CusobException(ResultCodeEnum.FIRST_NAME_IS_EMPTY);
        }
        if (!StringUtils.hasText(contactDto.getLastName())) {
            throw new CusobException(ResultCodeEnum.LAST_NAME_IS_EMPTY);
        }
        if (!StringUtils.hasText(contactDto.getEmail())) {
            throw new CusobException(ResultCodeEnum.EMAIL_IS_EMPTY);
        }
        if (!StringUtils.hasText(contactDto.getGroupName())) {
            throw new CusobException(ResultCodeEnum.GROUP_NAME_EMPTY);
        }
    }

    /**
     * get contact count by group
     *
     * @param groupId
     * @return
     */
    @Override
    public int getCountByGroup(Long groupId) {
        Long userId = AuthContext.getUserId();
        Integer count = baseMapper.selectCount(new LambdaQueryWrapper<Contact>().eq(Contact::getUserId, userId).eq(Contact::getGroupId, groupId));
        return count;
    }

    /**
     * get contact information By Id
     *
     * @param contactId
     * @return
     */
    @Override
    public ContactDto getContactById(Long contactId) {
        Contact contact = baseMapper.selectById(contactId);
        if (contact != null) {
            Long groupId = contact.getGroupId();
            Group group = groupService.getGroupById(groupId);
            ContactDto contactDto = new ContactDto();
            BeanUtils.copyProperties(contact, contactDto);
            contactDto.setGroupName(group.getGroupName());
            return contactDto;
        }
        return null;
    }

    /**
     * batch remove contacts
     *
     * @param idList
     */
    @Override
    public void batchRemove(List<Long> idList) {
        baseMapper.deleteBatchIds(idList);
    }

    /**
     * update Contact
     *
     * @param contactDto
     */
    @Override
    public void updateContact(ContactDto contactDto) {
        Contact select = baseMapper.selectById(contactDto.getId());
        if (!select.getUserId().equals(AuthContext.getUserId())) {
            throw new CusobException(ResultCodeEnum.UPDATE_CONTACT_FAIL);
        }
        this.paramVerify(contactDto);

        Group oldGroup = groupService.getGroupById(select.getGroupId());
        BeanUtils.copyProperties(contactDto, select);

        String newGroup = contactDto.getGroupName();
        if (!oldGroup.getGroupName().equals(newGroup)) {
            select.setGroupId(groupService.getGroupIdByName(newGroup));
        }
        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_CHECK_DIRECT, MqConst.ROUTING_CHECK_EMAIL, select);
        baseMapper.updateById(select);
    }


    /**
     * Contact List Pagination condition query
     *
     * @param contactQueryDto
     * @return
     */
    @Override
    public IPage<ContactVo> getContactList(Page<Contact> pageParam, ContactQueryDto contactQueryDto) {
        String keyword = contactQueryDto.getKeyword();
        Long groupId = contactQueryDto.getGroupId();
        Long userId = AuthContext.getUserId();
        Long companyId = AuthContext.getCompanyId();
        User user = userService.getById(userId);
        String SubscriptionType = contactQueryDto.getSubscriptionType();
        IPage<ContactVo> contactVoPage;
        if (user.getPermission().equals(User.USER)) {
            // user
            contactVoPage = baseMapper.pageQuery(pageParam, userId, keyword, groupId, SubscriptionType);
        } else {
            // admin
            contactVoPage = baseMapper.pageQueryByCompanyId(pageParam, companyId, keyword, groupId, SubscriptionType);
        }
        return contactVoPage;
    }

    /**
     * batch import contacts
     *
     * @param file
     */
    @Override
    public void batchImport(MultipartFile file, String groupName, String subscriptionType) {
        if (file == null) {
            throw new CusobException(ResultCodeEnum.FILE_IS_EMPTY);
        }
        Long userId = AuthContext.getUserId();
        Long companyId = AuthContext.getCompanyId();
        Long groupId = groupService.getGroupIdByName(groupName);

        try {
            InputStream inputStream = file.getInputStream();
            EasyExcel.read(inputStream, Contact.class, new ReadListener<Contact>() {
                private static final int BATCH_COUNT = 20;
                ArrayList<String> exceptionStrings = new ArrayList<>();
                ArrayList successImportList = new ArrayList<>();
                ArrayList repeatImportList = new ArrayList<>();
                ArrayList finalImportList = new ArrayList<>();
                private Integer successImport=0;
                private Integer failImport=0;
                private Integer repeatImport=0;
                ArrayList<Contact> contactArrayList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
                ContactImportVo contactImportVo = new ContactImportVo();
                @Override
                public void invoke(Contact contact, AnalysisContext analysisContext) {
                    contactArrayList.add(contact);
                    successImportList.add(contact);
                    if (contactArrayList.size() >= BATCH_COUNT) {
                        int sizeContact = contactArrayList.size();
                        for (Contact contactNull : contactArrayList) {
                            contactNull.setUserId(userId);
                            contactNull.setCompanyId(companyId);
                            contactNull.setGroupId(groupId);
                            contactNull.setSubscriptionType(subscriptionType);
                            contactNull.setIsAvailable(0);
                        }
                        saveExcelImport(groupName,contactArrayList,repeatImportList,finalImportList);
                        int sizeRepeat = repeatImportList.size();
                        successImport +=sizeContact;
                        repeatImport +=sizeRepeat;
                        contactArrayList.clear();
                    }
                }

                @Override
                public void doAfterAllAnalysed(AnalysisContext analysisContext) {
                    if (contactArrayList.size() > 0) {
                        int sizeContact = contactArrayList.size();
                        for (Contact contactNull : contactArrayList) {
                            contactNull.setUserId(userId);
                            contactNull.setCompanyId(companyId);
                            contactNull.setGroupId(groupId);
                            contactNull.setSubscriptionType(subscriptionType);
                            contactNull.setIsAvailable(0);
                        }
                        saveExcelImport(groupName,contactArrayList,repeatImportList,finalImportList);
                        int sizeRepeat = repeatImportList.size();
                        successImport +=sizeContact;
                        repeatImport +=sizeRepeat;
                        contactImportVo.setSuccessImport(successImport);
                        contactImportVo.setFailImport(failImport);
                        contactImportVo.setRepeatImport(repeatImport);
                        contactImportVo.setExceptionStrings(exceptionStrings);
                        contactImportVo.setSuccessImportList(successImportList);
                        contactImportVo.setRepeatImportList(repeatImportList);
                        contactImportVo.setFinalImportList(finalImportList);
                        contactImportVo.setUserId(userId);
                        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_IMPORTCHECK_DIRECT, // 发送消息到交换机
                                MqConst.ROUTING_IMPORTCHECK_EMAIL, contactImportVo);
                        contactArrayList.clear();
                        successImportList.clear();
                        repeatImportList.clear();
                        finalImportList.clear();
                    }
                }

                @Override
                public void onException(Exception exception, AnalysisContext context) throws Exception {
                    try{
                        if (exception instanceof ExcelDataConvertException) {
                            failImport++;
                            ExcelDataConvertException excelDataConvertException = (ExcelDataConvertException) exception;
                            exceptionStrings.add("Row {" + excelDataConvertException.getRowIndex() + "}, column {" + excelDataConvertException.getColumnIndex() + "} parse exception,Content:{" + excelDataConvertException.getCellData().getStringValue() + "}");
                            return;
                        }
                        if (exception instanceof CusobException){
                            failImport++;
                            CusobException exceptionCusob = (CusobException) exception;
                            String message = exceptionCusob.getMessage();
                            Integer code = exceptionCusob.getCode();
                            if (StrUtil.isNotBlank(message)){
                                exceptionStrings.add(code.toString());
                            }
                        }
                    } finally {

                    }
                }
            }).sheet().doRead();
            //使用 EasyExcel 库读取文件中的数据。Contact.class 指定了数据模型，PageReadListener<Contact> 是批量处理的监听器
//            EasyExcel.read(inputStream, Contact.class,new PageReadListener<Contact>(dataList ->{
//
//                if (count + dataList.size() >= plan.getContactCapacity()){
//                    throw new CusobException(ResultCodeEnum.CONTACT_NUMBER_FULL);
//                }
//                for (Contact contact : dataList) {
//                    contact.setUserId(userId);
//                    contact.setCompanyId(companyId);
//                    contact.setGroupId(groupId);
//                    contact.setSubscriptionType(subscriptionType);
//                    contact.setIsAvailable(1);
//                    try {
//                        rabbitTemplate.convertAndSend(MqConst.EXCHANGE_CHECK_DIRECT, // 发送消息到交换机
//                                MqConst.ROUTING_CHECK_EMAIL, contact); // 验证该邮箱是否真实存在（充分条件）
//                    } catch (Exception e) {
//                        System.err.println("Failed to send message: " + e.getMessage());
//                    }
//                    //baseMapper.insert(contact);
//                }
//            })).sheet().doRead();
        } catch (IOException e) {
            throw new CusobException(ResultCodeEnum.DATA_ERROR);
        }

    }

    @Override
    public Map<String, Object> parseFields(MultipartFile file) {
        if (file == null) {
            throw new CusobException(ResultCodeEnum.FILE_IS_EMPTY);
        }
        Map<String, Object> response = new HashMap<>();
        try (InputStream inputStream = file.getInputStream(); BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String headerLine = reader.readLine();
            if (headerLine == null) {
                throw new CusobException(ResultCodeEnum.FILE_IS_EMPTY);
            }
            // 将头部行拆分成字段列表
            List<String> headers = Arrays.asList(headerLine.split(","));
            // 返回字段列表
            response.put("fields", headers);

            return response;
        } catch (IOException e) {
            e.printStackTrace();
            response.put("error", "Failed to parse file");
            return response;
        }
    }


    /**
     * get Contact Count By Group id
     *
     * @param groupId
     * @return
     */
    @Override
    public Integer getContactCountByGroup(Long groupId) {
        Integer count = baseMapper.selectCount(new LambdaQueryWrapper<Contact>().eq(Contact::getUserId, AuthContext.getUserId()).eq(Contact::getGroupId, groupId));
        return count;
    }

    /**
     * get Count By User id
     *
     * @return
     */
    @Override
    public Integer getCountByUserId() {
        Long userId = AuthContext.getUserId();
        Integer count = baseMapper.selectCount(new LambdaQueryWrapper<Contact>().eq(Contact::getUserId, userId));
        return count;
    }

    /**
     * get contact List By Group id
     *
     * @param groupId
     * @return
     */
    @Override
    public List<Contact> getListByGroupId(Long groupId) {
        Long userId = AuthContext.getUserId();
        List<Contact> contactList = baseMapper.selectList(new LambdaQueryWrapper<Contact>().eq(Contact::getUserId, userId).eq(Contact::getGroupId, groupId));
        return contactList;
    }

    /**
     * select Contact Count By CompanyId
     *
     * @param companyId
     * @return
     */
    @Override
    public Integer selectCountByCompanyId(Long companyId) {
        Integer count = baseMapper.selectCount(new LambdaQueryWrapper<Contact>().eq(Contact::getCompanyId, companyId));
        return count;
    }

    /**
     * get List By UserId And GroupId
     *
     * @param userId
     * @param groupId
     * @return
     */
    @Override
    public List<Contact> getListByUserIdAndGroupId(Long userId, Long groupId) {
        List<Contact> contactList = baseMapper.selectList(new LambdaQueryWrapper<Contact>().eq(Contact::getUserId, userId).eq(Contact::getGroupId, groupId));
        return contactList;
    }

    /**
     * get All Contacts email By GroupId
     *
     * @param groupId
     * @return
     */
    @Override
    public List<String> getAllContactsByGroupId(Long groupId) {
        List<Contact> contactList = this.getListByUserIdAndGroupId(AuthContext.getUserId(), groupId);
        List<String> emailList = contactList.stream().map(Contact::getEmail).collect(Collectors.toList());
        return emailList;
    }

    @Override
    public List<Contact> getContactsByEmail(String email) {
        List<Contact> contacts = baseMapper.selectList(new LambdaQueryWrapper<Contact>().eq(Contact::getEmail, email));
        return contacts;
    }

    @Override
    public void saveUnsubsribedEmail(String email) {
        List<Contact> contacts = baseMapper.selectList(new LambdaQueryWrapper<Contact>().eq(Contact::getEmail, email));
        for (Contact contact : contacts) {
            contact.setSubscriptionType("Unsubscribed");
            baseMapper.updateById(contact);
        }

    }

    @Override
    public boolean saveExcelImport(String groupName, ArrayList<Contact> contactArrayList, ArrayList<Contact> repeatImportList,ArrayList<Contact> finalImportList) {
        Long companyId = AuthContext.getCompanyId();
        Integer count = this.selectCountByCompanyId(companyId);
        Company company = companyService.getById(companyId);
        Price plan = priceService.getPlanById(company.getPlanId());
        if (count >= plan.getContactCapacity()) {
            throw new CusobException(ResultCodeEnum.CONTACT_NUMBER_FULL);
        }
        ListIterator<Contact> contactListIterator = contactArrayList.listIterator();
        while (contactListIterator.hasNext()){
            Contact contact = contactListIterator.next();
            LambdaQueryWrapper<Contact> eq = new LambdaQueryWrapper<Contact>()
                    .eq(Contact::getEmail, contact.getEmail())
                    .eq(Contact::getUserId, contact.getUserId())
                    .eq(Contact::getGroupId,contact.getGroupId());
            int countContactNumber = this.count(eq);
            if (countContactNumber>0){
                repeatImportList.add(contact);
                contactListIterator.remove();
            }else {
                finalImportList.add(contact);
            }
        }
        boolean b = saveBatch(contactArrayList);
        return b;
    }
}
