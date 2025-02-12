package com.cusob.utils;

import com.cusob.entity.EmailServerInfo;
import org.xbill.DNS.Lookup;
import org.xbill.DNS.MXRecord;
import org.xbill.DNS.Record;
import org.xbill.DNS.Type;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class EmailServerResolver {

    public static void main(String[] args) {
        String email = "xiongtianle200@gmail.com";
        EmailServerInfo serverInfo = resolveEmailServer(email);
        if (serverInfo != null) {
            System.out.println("SMTP Server: " + serverInfo.getSmtpServer() + ":" + serverInfo.getSmtpPort());
            System.out.println("IMAP Server: " + serverInfo.getImapServer() + ":" + serverInfo.getImapPort());
        } else {
            System.out.println("Unable to resolve email server information.");
        }
    }

    public static EmailServerInfo resolveEmailServer(String email) {
        String domain = email.substring(email.indexOf("@") + 1);


        try {
            Record[] records = new Lookup(domain, Type.MX).run();
            if (records != null && records.length > 0) {
                MXRecord mx = (MXRecord) records[0];
                String mxTarget = mx.getTarget().toString();
                System.out.println("MX Record: " + mxTarget);

            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}
