'use client';
import styles from './page.module.scss';
import EnteredHeader from "@/component/EnteredHeader";
import SideBar from "@/component/SideBar";
import {Button, Popconfirm, PopconfirmProps, Space, Table, TableProps} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useEffect, useState} from "react";
import {getDomainList} from "@/server/domain";
import {SUCCESS_CODE} from "@/constant/common";
import classNames from "classnames";
import {useRouter} from "next/navigation";
import {getSenderList, removeSender} from "@/server/sender";


const {
    emailListContainer,
    main,
    containerHeader,
    title,
    addSender,
    buttonAdd,
    content,
    domainBox,
    domainTitle,
    domainItem,
    active,

} = styles

type DataType = {
    id: number;
    key: string;
    email: string;
    domain: string;
}

const EmailList = () => {

    const router = useRouter()
    const [domainList, setDomainList] = useState<{domain:string, id:number}[]>([]);
    const [activeDomainId, setActiveDomainId] = useState<number>(-1);
    const [emailList, setEmailList] = useState<{id:number, key:string, email:string, domain:string}[]>([]);

    const initDomainList = async () => {
        const res = await getDomainList();
        if (res.code === SUCCESS_CODE && res.data){
            setDomainList(res.data.map((item: { id: number }) => ({ ...item, key: item.id })) || [])
        }
    }

    const initEmailList = async () => {
        const res = await getSenderList()
        if (res.code === SUCCESS_CODE && res.data){
            setEmailList(res.data.map((item: { id: number, email: string }) => (
                { ...item, key: item.id, domain: item.email.substring(item.email.lastIndexOf('@')+1) })) || []
            )
        }
    }

    const onDomainItemClick = (domainItem: {domain:string, id:number}) => {
        setActiveDomainId(domainItem.id)
    }

    const pushToAddSender = () => {
        router.push("/addSender")
    }
    
    const removeSenderById = async (id: number) => {
        const res = await removeSender(id)
        if (res.code == SUCCESS_CODE ){
            initEmailList()
        }
    }

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
    };

    useEffect(() => {
        initDomainList()
        initEmailList()
    }, []);

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Sender Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Domain',
            dataIndex: 'domain',
            key: 'domain',
            render: (domain) => (
                <Link href="/senderList">{domain}</Link>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Delete the sender"
                        description="Are you sure to delete this sender?"
                        onConfirm={() => removeSenderById(record.id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return <div className={emailListContainer}>
        <EnteredHeader/>
        <SideBar/>
        <div className={main}>
            <div className={containerHeader}>
                <div className={title}>
                    <span>Sender</span>
                    <span style={{margin: '0 0.5em', color: '#666'}}>/</span>
                    <span style={{color: '#999999'}}> All Senders</span>
                </div>
                <div className={addSender}>
                    <Button onClick={pushToAddSender} className={buttonAdd}>Add Sender</Button>
                </div>
            </div>

            <div className={content}>
                <Table<DataType>
                    columns={columns}
                    dataSource={emailList}
                />
            </div>
        </div>
        <div className={domainBox}>
            <div className={title}>Senders</div>
            <div className={domainTitle}>Domain</div>
            {
                domainList.map((item, index) => <div
                    className={classNames(domainItem, { [active]: item.id === activeDomainId })}
                    key={index}
                    onClick={() => onDomainItemClick(item)}
                >
                    {item.domain}
                </div>)
            }
        </div>

    </div>
}

export default EmailList;