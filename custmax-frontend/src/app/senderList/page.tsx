'use client'
import styles from './page.module.scss';
import EnteredHeader from "@/component/EnteredHeader";
import SideBar from "@/component/SideBar";
import {Button, Input, message, Modal, Space, Table, TableProps} from "antd";
import {getDomainList, saveDomain} from "@/server/domain";
import React, {useEffect, useState} from "react";
import {SUCCESS_CODE} from "@/constant/common";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {createdomain, getdomain} from "@/server/mailu/Domain";
import {getDomain} from "@/server/sendcloud/domain";

type DataType = {
    key: string;
    domain: string;
    spf: boolean;
    dkim: boolean;
}

const {
    senderListContainer,
    main,
    addSender,
    buttonAdd,
    tableDomain,
    create,
    input,
    detail,
} = styles;

const SenderList = () => {
    const [domainName, setDomainName] = useState('');

    const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setDomainName(e.target.value);
    };

    const handleOk = () => {
        console.log('Domain name:', domainName);
        // 在这里处理确认逻辑，例如发送请求到服务器
    };

    const router = useRouter()
    const [domainList, setDomainList] = useState<DataType[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [show,setShow] = useState(false)
    const initDomainList = async () => {
        message.loading({ content: 'loading', duration: 10, key: 'loading' })
        const res = await getDomainList();
        message.destroy('loading')
        if (res.code === SUCCESS_CODE && res.data){
            setDomainList(res.data.map((item: { id: number }) => ({ ...item, key: item.id })) || [])
        }
    }

    useEffect(() => {
        initDomainList()
    }, []);

    const adddomain=()=>{
        setShow(true)
    }
    const onCancel = () =>{
        setShow(false)
    }

    const save = async () => {
        const r = await getdomain(domainName);
        // const data = {
        //     dkimDomain: r.info.dataList[0]['dkim.domain'],
        //     dkimValue: r.info.dataList[0]['dkim.value'],
        //     dmarcDomain: r.info.dataList[0]['dmarc.domain'],
        //     dmarcValue: r.info.dataList[0]['dmarc.value'],
        //     mxDomain: r.info.dataList[0]['mx.domain'],
        //     mxValue: r.info.dataList[0]['mx.value'],
        //     domain: r.info.dataList[0]['name'],
        //     spfDomain: r.info.dataList[0]['spf.domain'],
        //     spfValue: r.info.dataList[0]['spf.value'],
        //     verify: r.info.dataList[0]['verify']
        // };
        // const res = await saveDomain(data);
        // if(res.code === SUCCESS_CODE){
        //     message.success("Add successfully!")
        // }else {
        //     message.error(res.message)
        // }
        setShow(false);
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Status',
            dataIndex: 'domain',
            key: 'domain',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Sender Domain',
            dataIndex: 'domain',
            key: 'domain',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'IP Type',
            key: 'ipType',
            render: () => (
                <Space size="middle">
                    Shared IP
                </Space>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/domainCertify?domain=${record.domain}`}>Setting</Link>
                    <a>Update</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    return <div className={senderListContainer}>
        <EnteredHeader />
        <SideBar />
        <div className={main}>
            <div className={addSender}>
                <Button onClick={adddomain} className={buttonAdd}>Add Domain</Button>
            </div>
            <div className={tableDomain}>
                <Table columns={columns} dataSource={domainList}></Table>
            </div>
        </div>
        <Modal
            title="Add domain"
            open={show}
            okText='Done'
            onOk={save}
            onCancel={onCancel}
            >
            <div className={create}>
                <div className={input}>
                    <form >
                        <div>
                            <span style={{ color: 'red' }}>*</span> Please enter the sending domain name：
                            <Input value={domainName} onChange={handleInputChange}/>
                            <span className={detail}>Please provide your own domain name and support DNS configuration for domain name verification in the future！</span>
                        </div>
                        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                    </form>
                </div>
            </div>
        </Modal>
    </div>
}

export default SenderList;
