'use client'
import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import {Button, Input, message, Select, Table, Tag} from 'antd';

import {SUCCESS_CODE} from "@/constant/common";


import {domainVerify, saveDkim, saveDomain, SavedomainSender} from "@/server/domain";

import {useRouter, useSearchParams} from "next/navigation";

import React, {useCallback,useEffect, useState} from 'react';

import type { TableProps } from 'antd';
import {CopyOutlined} from "@ant-design/icons";
import copy from "copy-to-clipboard";
import {createdomain, generateDkim, getdomain} from "@/server/mailu/Domain";
import {createUser, getUser} from "@/server/mailu/user";
import {afterWrite} from "@popperjs/core";
import {checkuuid} from "@/server/sender";


interface DataType {
  key: string;
  name: string;
  status: string; // 改为 string 类型以匹配状态值
  type: string;
  hostRecords: string;
  hostname: string;
  Enter_this_value: string;

}


const {
  domainCertifyContainer,
  main,
  title,
  tab,
  check,
  ver,
} = styles;

const handleCopy = (value: string) => {
  copy(value)
  message.success("Copy Success")
}

// 定义了表格的列配置，每列对应一个 DNS 记录的字段。包括列名、数据字段、宽度，以及在某些列中自定义的渲染逻辑。
const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '10%',
    render: (_, { name }, index) => {
      if (index < 2) { // 只在前两行添加星号
        return (
            <>
              <span style={{ color: 'red' }}>*</span>
              {name}
            </>
        );
      }
      return name;
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: '10%',
    render: (_, { status }) => {
      let color = status === 'Verified' ? 'green' : 'red';
      return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
      );
    },
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: '10%',

  },
  {
    title: 'HostRecords',
    dataIndex: 'hostRecords',
    key: 'hostRecords',
    width: '15%',
    render: (value) => <div style={{ wordWrap: 'break-word' }}>{value}</div>,
  },
  {
    title: 'Hostname',
    dataIndex: 'hostname',
    key: 'hostname',
    width: '20%',
    render: (value) => <div style={{ wordWrap: 'break-word' }}>{value}</div>,
  },
  {
    title: 'Enter this value',
    dataIndex: 'Enter_this_value',
    key: 'Enter_this_value',
    width: '30%',
    render: (value:string) => (
        <div style={{ whiteSpace: 'normal' }}>
          <span style={{ marginRight: '5px' }}>{value}</span>
          {
            //@ts-ignore
            <CopyOutlined style={{cursor: 'pointer'}} onClick={() => handleCopy(value)}
                         onPointerOverCapture={undefined} onPointerOutCapture={undefined}/>}
        </div>
    ),
    ellipsis: true, // 添加这行来启用省略号

  },
];

const DomainCertify = () => {
  const [domain, setDomain] = useState('')
  const [dkimValue, setDkimValue] = useState<string>('')
  const [selector, setSelector] = useState('')
  const [email, setEmail] = useState('')
  const [domainValue, setDomainvalue] = useState('')
  const searchParams = useSearchParams()
  const uuid = searchParams.get("uuid")

  const router = useRouter();

  const fetchEmail = async () =>{
    console.log('aaaa')
    const res = await checkuuid(uuid)//获取uuid对应的email
    if(res.code === SUCCESS_CODE){
      setEmail(res.data)
      setDomainvalue(res.data.split('@')[1])//获取email对应的domain

    }else {
      message.error('Your information is incorrect!')
    }
  }

  useEffect(() => {
      fetchEmail()

  }, []);

  useEffect(() => {
    if (email && domainValue) {
      fetchData();//获取domain的DNS信息
    }
  }, [email, domainValue]);

  const generatePassword = () =>{ //生成8位包含数字和字母的密码
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let generatedPassword = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatedPassword += chars[randomIndex];
    }
    return generatedPassword;
  }

  const handleVerify = async () => {
    const verify = await domainVerify(domainValue);
    if(verify.data.spf && verify.data.dkim){
      const find = await getUser(email);
      if(!find){
        const password = generatePassword();
        console.log(password)
        await createUser(email, password);//新增User
        const res = await SavedomainSender(email, password)
        if(res.code === SUCCESS_CODE){
          message.success('Verified!')
          router.push('/emailList')
        }
      }else {
        message.error('This email has been used')
        return
      }
    }
  }

  const handleDomainVerify = async (domain: string) => {
    message.loading({content: 'loading', duration: 10, key: 'listLoading'})
    const res = await domainVerify(domain)
    message.destroy('listLoading')
    if (res.code === SUCCESS_CODE && res.data) {
      router.push("/senderList")
    }
  }

  const getmessage = async (domain: string | null) => {//获取DNS信息
    const r = await getdomain(domainValue)
    // console.log(domainValue)
    const data = {
      dkimDomain: 'dkim._domainkey.' + domainValue,
      dkimValue: r.dns_dkim.split('TXT "')[1].replaceAll('\"', ''),
      dmarcDomain: '_dmarc.' + domainValue,
      dmarcValue: r.dns_dmarc.split('TXT "')[1].replaceAll('\"', ''),
      mxDomain: domainValue,
      mxValue: r.dns_mx.split('MX ')[1].split(' ')[1],
      domain: domainValue,
      spfDomain: domainValue,
      spfValue: r.dns_spf.split('TXT "')[1].replaceAll('\"', ''),
    };
    console.log(data)
    return data;
  }

  const fetchData = async () => {
    message.loading({content: 'loading', duration: 10, key: 'listLoading'})
    const res = await createdomain(domainValue);//mailu创建domain
    console.log("mailu api返回："+res)
    if(res.code === SUCCESS_CODE){
        const res = await generateDkim(domainValue);
        console.log("generateDkim返回："+res)
        if(res.code === SUCCESS_CODE){ //如果为第一次创建
          const data = await getmessage(domainValue);  //获取DNS数据
          await saveDomain(data); // 保存domain至数据库
        }
    }
    // @ts-ignore
    console.log("domainValue:"+domainValue)
    const dotCount = (domainValue.match(/\./g) || []).length;
    const verify = await domainVerify(domainValue);
    message.destroy('listLoading')
    let host = '@';
    let hostname = domainValue;
    if(dotCount === 2){
      // @ts-ignore
      host = domainValue.split('.')[0];
      // @ts-ignore
      hostname = domainValue.split('.')[1]
    }
    const data = await getmessage(domainValue);
    const status = {'spf_status': verify.data.spf,
      'dkim_status':verify.data.dkim,
      'mx_status':verify.data.mx,
      'dmarc_status':verify.data.dmarc}

    const spf_status = status.spf_status ? 'Verified' : 'Unverified';
    const dkim_status = status.dkim_status ? 'Verified' : 'Unverified';
    // const mx_status = status.mx_status ? 'Verified' : 'Unverified';
    const dmarc_status = status.dmarc_status ? 'Verified' : 'Unverified';
    const tableData: DataType[] = [
      {
        key: '1',
        name: 'SPF',
        status: spf_status , // 示例状态值
        type: 'TXT',
        hostRecords: host,
        hostname: hostname || '',
        Enter_this_value: data.spfValue,

      },
      {
        key: '2',
        name: 'DKIM',
        status: dkim_status, // 示例状态值
        type: 'TXT',
        hostRecords: data.dkimDomain,
        hostname:hostname || '',
        Enter_this_value: data.dkimValue,

      },
      // {
      //   key: '3',
      //   name: 'MX',
      //   status: mx_status, // 示例状态值
      //   type: 'MX',
      //   hostRecords: domainValue || '',
      //   hostname: hostname || '',
      //   Enter_this_value: data.mxValue,
      //
      // },
      {
        key: '4',
        name: 'DMARC',
        status: dmarc_status, // 示例状态值
        type: 'TXT',
        hostRecords: data.dmarcDomain,
        hostname: hostname || '',
        Enter_this_value: data.dmarcValue,
      },

    ];
    // 将 res 中的数据转换成表格需要的格式，并存储到 tableData 中
    setDomainData(tableData);
  };

  const [domainData, setDomainData] = useState<DataType[]>([]);

  function handleButtonClick() {
    fetchData();
    message.success('Checked!')
  }

  return <div className={domainCertifyContainer}>
    <EnteredHeader/>
    <SideBar/>
    <div className={main}>
      <div className={title}>Domain Auth For {domain}
        <div className={check}><Button type="primary" onClick={handleButtonClick} >Check Status</Button></div>
      </div>

    <div className={tab}>
      <Table columns={columns}
             dataSource={domainData}
             pagination={false}
      />
    </div>
      <div className={ver}><Button type="primary" onClick={handleVerify} >Verify Email</Button></div>
    </div>
  </div>
};

export default DomainCertify;
