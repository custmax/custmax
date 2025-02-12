'use client'
import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import ImgWrapper from '@/component/ImgWrapper';
import Link from 'next/link';
import {Table, TableProps, message, PaginationProps} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getOrderHistory } from '@/server/orderHistory';
import { SUCCESS_CODE } from '@/constant/common';
import {getHistoryList, getList} from "@/server/contact";

type DataType = Order.orderHistory & { key: number }

const {
  billingHistoryContainer,
  main,
  title,
  content,
  historyIcon,
  emptyText,
  emptyTip,
  link,
} = styles;

const pageSize = 10;

const BillingHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [historyList, setHistoryList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false);
  const initOrderHistory = useCallback(async () => {
    setLoading(true); // 开始加载
    message.loading({ content: 'loading', duration: 10, key: 'listLoading' })
    const res = await getOrderHistory(currentPage, pageSize)
    console.log(res)
    setTotal(res.data?.total)
    message.destroy('listLoading')
    if (res.code === SUCCESS_CODE) {
      setHistoryList(res.data?.records.map((item: { id: number }) => ({ ...item, key: item.id })) || [])
      setLoading(true); // 加载结束
    }

  }, [currentPage, pageSize])

  useEffect(() => {
    initOrderHistory()
  }, [initOrderHistory])
  const onPageChange: PaginationProps['onChange'] = async (pageNumber:number) => {
    setCurrentPage(pageNumber)
    message.loading({ content: 'loading', duration: 10, key: 'listLoading' })
    const res = await getOrderHistory(pageNumber, pageSize)
    message.destroy('listLoading')
    if (res.code === SUCCESS_CODE) {
      console.log(res.data)
      setHistoryList(res.data?.records.map((item: { id: number }) => ({ ...item, key: item.id })) || [])
      setTotal(res.data?.total)
    }
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Plan Name',
      dataIndex: 'planName',
      key: 'planName',
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: (_item, record) => <div>
        <div>Contacts: {record.contactCapacity}</div>
        <div>Sends: {record.emailCapacity}</div>
      </div>
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (_item, record) => <div>
        <div>US${record.totalAmount}</div>
      </div>
    },
    {
      title: 'Create time',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ];
  const pagination = {
    currentPage: currentPage,
    pageSize: pageSize,
    defaultCurrent: 1,
    total: total,
    onChange: onPageChange,
  }
  // if (loading) {  // 判断是否在加载
  //   return <div>Loading...</div>; // 或者可以使用一个加载动画
  // }
  return <div className={billingHistoryContainer}>
    <EnteredHeader />
    <div className={main}>
      <div className={title}>Billing history</div>
      {
        historyList.length>0
          // loading
          ? <Table
            columns={columns}
            dataSource={historyList}
            pagination={pagination}
          />
          : <div className={content}>
              <ImgWrapper className={historyIcon} src='/img/history_icon.png' alt='history icon' />
              <div className={emptyText}>You don&#39;t have any billing history</div>
              <div className={emptyTip}>
                <span>If you </span>
                <Link className={link} href='/account'>upgrade to a paid account</Link>
                <span> or </span>
                <Link className={link} href='/account'>purchase monthly credits,</Link>
                <span> you&#39;ll see a history of your payments here.</span>
              </div>
          </div>
      }
    </div>
  </div>
};

export default BillingHistory;
