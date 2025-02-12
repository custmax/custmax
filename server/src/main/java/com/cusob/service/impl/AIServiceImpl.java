package com.cusob.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cusob.dto.PromptDto;
import com.cusob.entity.Contact;
import com.cusob.entity.Group;
import com.cusob.mapper.GroupMapper;
import com.cusob.service.AIService;
import com.cusob.service.ContactService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AIServiceImpl extends ServiceImpl<GroupMapper, Group> implements AIService {

    private static final String API_URL = "https://api.lmtchina.com/v1/chat/completions";
    private static final String API_KEY = "sk-s4m3t5mPXE6FRbvr487f6dC27e5343029120819e52C500E9";
//    private static final String API_URL = "https://new.xi-ai.cn/v1/chat/completions";
//    private static final String API_KEY = "sk-uGf3I1jxki3aTCZ5C43fE77c6dA0428089843b1166Ce81B2";
    private final ObjectMapper objectMapper = new ObjectMapper();//Jackson库的ObjectMapper类，作用是将Java对象转换成JSON格式或者反过来
    @Autowired
    private ContactService contactService;
    @Override
    public String generateByGroup(PromptDto promptDto) {
        Long groupId = Long.parseLong(promptDto.getGroupId());
        String content = promptDto.getContent();
        Group group = baseMapper.selectById(groupId);
        List<Contact> contactList=contactService.getListByGroupId(groupId);
        String groupName = group.getGroupName();
        String businessInfo = concatenateNotes(contactList);//将联系人的note字段连接成一个字符串
        System.out.println("bbbbbbbb:"+businessInfo);
        String prompt = String.format(
                "请生成一封接地气和地道的邮件为本公司的产品推广,这封邮件的目的是让客户回复本邮件或拨打邮件中的电话。我们公司的产品介绍和独特卖点是：%s, 给客户一个不得不选择我们的理由，邮件的接收方是我们的目标客户以及潜在客户，请精准挖掘他们的需求，同时保证邮件内容对于他们每个人是个性化且有吸引力的。",
                //"请生成一封邮件为本公司的产品营销，只要正文不要标题。这是我们公司产品介绍和独特卖点：%s，请从中挖掘出使客户选择本公司产品的特别之处，并结合在邮件中体现，如下是一组邮件接受方（即本公司的目标客户）的基本业务信息为%s，请精准挖掘他们的需求，同时保证邮件内容对于他们是个性化且有吸引力的。当完成这封邮件后，你还需要将邮件内容将对方的称呼改为#{FIRSTNAME}#{LASTNAME}，将对方公司的称呼改为#{COMPANY}",
                content
                //generateRecipientInfo(businessInfo)
        );

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(API_URL);

            // 请求头
            request.setHeader("Accept", "application/json");
            request.setHeader("Authorization", "Bearer " + API_KEY);
            request.setHeader("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
            request.setHeader("Content-Type", "application/json");

            // 请求体
            JSONObject json = new JSONObject();
            json.put("model", "gpt-3.5-turbo");
            json.put("messages", new JSONObject[]{ new JSONObject().put("role", "user").put("content", prompt) });

            StringEntity entity = new StringEntity(json.toString(), "UTF-8");
            request.setEntity(entity);

            HttpResponse response = httpClient.execute(request);
            HttpEntity responseEntity = response.getEntity();
            String responseString = EntityUtils.toString(responseEntity, "UTF-8");
            JsonNode rootNode = objectMapper.readTree(responseString);

            // 获取 choices 数组
            JsonNode choicesNode = rootNode.path("choices");

            // 提取第一个 choice 的内容
            if (choicesNode.isArray() && choicesNode.size() > 0) {
                JsonNode firstChoice = choicesNode.get(0);
                JsonNode messageNode = firstChoice.path("message");
                System.out.println(messageNode.path("content").asText());

                return messageNode.path("content").asText();
            }
            //System.out.println(responseString);
            //return responseString;

            return "Error: null";

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    private String generateRecipientInfo(String businessInfo) {
        return new JSONObject()
                .put("业务介绍", businessInfo != null ? businessInfo : "默认业务介绍")
                .toString();
    }
    public String concatenateNotes(List<Contact> contactList) {
        // 使用Stream API提取每个联系人的note并连接成一个字符串
        return contactList.stream()
                .map(Contact::getNote)   // 提取note字段
                .filter(note -> note != null && !note.isEmpty()) // 过滤掉null或空字符串
                .collect(Collectors.joining(", ")); // 用逗号连接
    }
}
