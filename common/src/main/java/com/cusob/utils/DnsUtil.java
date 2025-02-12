package com.cusob.utils;

import org.xbill.DNS.*;
import org.xbill.DNS.Record;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

public class DnsUtil {

    public static List<String> checkSpf(String domain){
        try {
            Lookup lookup = new Lookup(domain, Type.TXT);
            lookup.setResolver(new SimpleResolver("1.1.1.1")); // 使用Google的公共DNS服务器，你也可以使用其他DNS服务器
            Record[] records = lookup.run();
            List<String> spfTxtRecords = new ArrayList<>();
            if (records==null || records.length==0){
                return null;
            }
            for (Record record : records) {
                if (record instanceof TXTRecord) {
                    TXTRecord txtRecord = (TXTRecord) record;
                    List<String> txts = txtRecord.getStrings();
                    for (String txt : txts) {
                        if (txt.startsWith("v=spf1")) { // SPF记录通常以"v=spf1"开头
                            spfTxtRecords.add(txt);
                        }
                    }
                }
            }
            return spfTxtRecords;
        } catch (TextParseException | UnknownHostException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static List<String> checkmx(String domain){
        try {
            Lookup lookup = new Lookup(domain, Type.MX);
            lookup.setResolver(new SimpleResolver("1.1.1.1")); // 使用Cloudflare的公共DNS服务器
            Record[] records = lookup.run();
            List<String> mxRecords = new ArrayList<>();
            if (records == null || records.length == 0) {
                return null;
            }
            for (Record record : records) {
                if (record instanceof MXRecord) {
                    MXRecord mxRecord = (MXRecord) record;
                    mxRecords.add(mxRecord.getTarget().toString());
                }
            }
            return mxRecords;
        } catch (TextParseException | UnknownHostException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static List<String> checkdmarc(String domain){
        try {
            String dmarc = "_dmarc."+domain;
            Lookup lookup = new Lookup(dmarc, Type.TXT);
            lookup.setResolver(new SimpleResolver("1.1.1.1")); // 使用Cloudflare的公共DNS服务器
            Record[] records = lookup.run();
            List<String> dmarcRecords = new ArrayList<>();
            StringBuilder dmarcRecord = new StringBuilder();
            if (records == null || records.length == 0) {
                return null;
            }
            for (Record record : records) {
                if (record instanceof TXTRecord) {
                    TXTRecord txtRecord = (TXTRecord) record;
                    List<String> strings = txtRecord.getStrings();
                    for (String str : strings) {
                        dmarcRecord.append(str);
                    }
                     dmarcRecords.add(dmarcRecord.toString());
                }
            }
            return dmarcRecords;
        } catch (TextParseException | UnknownHostException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static List<String> checkDkim(String domain,String selector){

        try {
            // 构造DKIM记录的查询名称，通常是"<selector>._domainkey.<domain>"
            String dkimRecordName = selector + "."  + "_domainkey."+ domain;
            /*
            * 接收查询域名和类型参数*/
            Lookup lookup = new Lookup(dkimRecordName, Type.TXT);
            lookup.setResolver(new SimpleResolver("1.1.1.1")); // 使用Cloudflare的公共DNS服务器
            Record[] records = lookup.run();
            if (records==null || records.length==0){
                return null;
            }
            List<String> dkimTxtRecords = new ArrayList<>();
            StringBuilder dkimRecord = new StringBuilder();
            for (Record record : records) {
                if (record instanceof TXTRecord) {
                    TXTRecord txt = (TXTRecord) record;
                    List<String> strings = txt.getStrings();
                    for (String str : strings) {
                        dkimRecord.append(str);
                    }
                    dkimTxtRecords.add(dkimRecord.toString());
                }
            }

            return dkimTxtRecords;
        } catch (TextParseException | UnknownHostException e) {
            e.printStackTrace();
            return null;
        }
    }


    public static void main(String[] args) {
        String domain = "daybreakhust.top";

    }
}
