'use client'

import ImgWrapper from '@/component/ImgWrapper';
import styles from './index.module.scss';
import {Select, message, Button} from 'antd';
import { useCallback, useEffect, useState } from 'react';
// import { getContactCapacityList, getPlanByContactCapacity } from '@/server/plan';
import { SUCCESS_CODE } from '@/constant/common';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import { payCancel } from '@/server/payment';
import {getToken} from "@/util/storage";
import {getPriceList, getContactCapacityList, getPlanById} from "@/server/price";
import {number} from "prop-types";
import {getPay} from "@/server/pay";


const {
  month,
  year,
  priceListContainer,
  filterBox,
  left,
  timeSelector,
  right,
  label,
  value,
  numSelector,
  currencySelector,
  priceCardList,
  priceCard,
  title,
  moneyBox,
  tip,
  payBtn,
  btnDisable,
  line,
  rightList,
  rightItem,
  tickIcon,
  rightText,
    buttonselected,
    button,
} = styles;

const nameMapFunction: Record<string, { userNum: number | string, customerSupport: string }> = {
  'Free': {
    userNum: 1,
    customerSupport: 'Email support for first 30 days',
  },
  'Essentials': {
    userNum: 5,
    customerSupport: '24/7 Email & Chat Support',
  },
  'Standard': {
    userNum: 10,
    customerSupport: '24/7 Email & Chat Support',
  },
  'Premium': {
    userNum: 'Unlimited',
    customerSupport: 'Phone & Priority Support',
  }
}

const PriceList = () => {//
  const [plans, setPlans] = useState<Price.PriceItem[]>([])//
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const [contactCapacity, setContactCapacity] = useState(500)
  const [months, setMonths] = useState(1)
  const [currency, setCurrency] = useState(0)
  const [capacityList, setCapacityList] = useState<{value: number, label:number}[]>([])
  const order = ['Free', 'Essentials', 'Standard', 'Premium'];

  const initPriceList = async () => {//初始化价格列表
    message.loading({ content: 'loading', duration: 10, key: 'loading' })//显示加载中
    const res = await getPriceList(contactCapacity, months, currency)//获取价格列表
    message.destroy('loading')//销毁加载中
    if (res.code === SUCCESS_CODE && res.data && res.data.length) {//如果返回成功
      console.log(res.data)//打印数据
      // 自定义排序函数
      res.data.sort((a:any, b:any) => {//
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
      setPlans(res.data)
      console.log(res.data)
    }
  }

  const initContactCapacity = async () =>{//初始化联系人容量
    const res = await getContactCapacityList()//获取联系人容量列表
    if (res.code === SUCCESS_CODE && res.data && res.data.length){
      const newOptions = res.data.map((item: number) => ({value: item, label: item}))
      setCapacityList(newOptions)
    }
  }

  const initPayCancel = useCallback(async () => {//初始化支付取消
    if (type === 'cancelPay') {//如果type为取消支付
      const res = await payCancel()//取消支付
      if (res.code === SUCCESS_CODE) {
        window.location.replace("/pricing");
      } else {
        message.error(res.message)
      }
    }
  }, [type])

  useEffect(() => {//使用effect
    initContactCapacity()
    initPayCancel()
    initPriceList()
  }, [initPayCancel])

  // capacity
  const onNumSelect = async (value: number) => {
    setContactCapacity(value);
    message.loading({ content: 'loading', duration: 10, key: 'loading' });

    const months = selectedPeriod === 'Monthly' ? 1 : 12;
    console.log("aaa", months);

    const res = await getPriceList(value, months, currency);
    if (res.code === SUCCESS_CODE && res.data && res.data.length) {
      res.data.sort((a: any, b: any) => {
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
      setPlans(res.data);
    }

    message.destroy('loading');
  };

  // const onMonthsChange = async (value: string) => {//月份改变
  //   message.loading({ content: 'loading', duration: 10, key: 'loading' })
  //   if (value === 'Monthly'){
  //     setMonths(1)
  //     const res = await getPriceList(contactCapacity, 1, currency)
  //     if (res.code === SUCCESS_CODE && res.data && res.data.length) {
  //       // 自定义排序函数
  //       res.data.sort((a:any, b:any) => {
  //         return order.indexOf(a.name) - order.indexOf(b.name);
  //       });
  //       setPlans(res.data)
  //     }
  //   }else {
  //     setMonths(12)
  //     const res = await getPriceList(contactCapacity, 12, currency)
  //     if (res.code === SUCCESS_CODE && res.data && res.data.length) {
  //       // 自定义排序函数
  //       res.data.sort((a:any, b:any) => {
  //         return order.indexOf(a.name) - order.indexOf(b.name);
  //       });
  //       setPlans(res.data)
  //     }
  //   }
  //   message.destroy('loading')
  // }

  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

  const onMonthsChange = async (value:string) => {
    message.loading({ content: 'loading', duration: 10, key: 'loading' });
    const months = value === 'Monthly' ? 1 : 12;
    console.log(months);
    setSelectedPeriod(value);

    const res = await getPriceList(contactCapacity, months, currency);
    if (res.code === SUCCESS_CODE && res.data && res.data.length) {
      res.data.sort((a:any, b:any) => order.indexOf(a.name) - order.indexOf(b.name));
      setPlans(res.data);
    }

    message.destroy('loading');
  };

  const onBuyClick = async (value: number) => {
    const token = getToken();
    if (token.length > 0) {
      try {
        const res = await getPay(value);
        if (res.url) {
          window.location.href = res.url; // 跳转到 Stripe 支付页面
        } else {
          console.error("No URL found in response.");
        }
      } catch (error) {
        console.error("Error fetching payment URL:", error);
      }
    } else {
      router.push("/login");
    }
  }


  const contactCapacityString = contactCapacity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const contactCapacityLength = contactCapacityString.length;
  const insertPosition = contactCapacityLength - 3;
  // @ts-ignore
  const formattedStringWithComma = `${contactCapacityString.slice(0, insertPosition)}${contactCapacityString.slice(insertPosition)}`;

  return <div className={priceListContainer}>
    <div className={timeSelector}>
      <div className={month}>
        <p
            className={selectedPeriod === 'Monthly' ? buttonselected : button}
            onClick={() => onMonthsChange('Monthly')}
        >Monthly
        </p>
      </div>
      <div className={year}>
        <p
            className={selectedPeriod === 'Yearly' ? buttonselected : button}
            onClick={() => onMonthsChange('Yearly')}
        >Yearly

        </p>
      </div>
    </div>
    <div className={filterBox}>
      <div className={left}>
        <div className={label}>How many contacts</div>
        <div className={value}>
          <Select
              className={numSelector}
              value={contactCapacity}
              onChange={onNumSelect}
              options={capacityList}
          />
        </div>
      </div>
      {/*<div className={timeSelector}>*/}
      {/*  <Select*/}
      {/*      className={currencySelector}*/}
      {/*      defaultValue='Monthly'*/}
      {/*      onChange={onMonthsChange}*/}
      {/*      options={[*/}
      {/*        { value: 'Monthly', label: 'Monthly' },*/}
      {/*        { value: 'Yearly', label: 'Yearly' },*/}
      {/*      ]}*/}
      {/*  />*/}
      {/*</div>*/}

      <div className={right}>
        <div className={label}>Prices in</div>
        <Select
            className={currencySelector}
            defaultValue="USD"
            // onChange={onCurrencySelect}
            options={[
              {value: 0, label: 'USD'},
              // { value: 1, label: 'EUR' },
              // { value: 2, label: 'HKD' },
              // { value: 3, label: 'JPY' },
            ]}
        />
      </div>
    </div>
    <div className={priceCardList}>
      {
        plans.map((item, index) => <div className={priceCard} key={index}>
          <div className={title}>{item.name}</div>
          <div className={moneyBox}>
            <div className={label}>US$</div>
            <div className={value}>{item.amountUSD}</div>
          </div>
          <div
              className={tip}>{nameMapFunction[item.name]?.userNum} {item.name === 'Premium' ? 'users' : `user${nameMapFunction[item.name]?.userNum === 1 ? '' : 's'}`}</div>
          <div className={tip}>{formattedStringWithComma + ' contacts'}</div>
          <div
              className={tip}>{item.name === 'Premium' ? 'Unlimited Monthly Email Sends' : `${item.emailCapacity} Monthly Email Sends`}</div>
          <div className={tip}>{nameMapFunction[item.name]?.customerSupport}</div>
          <Button disabled={item.isAvailable === 0} onClick={() => onBuyClick(item.id)}
                  className={item.isAvailable === 1 ? payBtn : btnDisable}>{item.name === 'Free' ? 'Sign Up' : 'Buy Now'}</Button>
          <div className={line}></div>
          <div className={rightList}>
            <div className={rightItem}>
              {
                item.name === 'Free'
                    ? <ImgWrapper className={tickIcon} alt='world' src='/img/slash.png'/>
                    : <ImgWrapper className={tickIcon} alt='world' src='/img/tick_icon.png'/>
              }
              <span className={rightText}>Remove Cusob Branding</span>
            </div>
            <div className={rightItem}>
              {
                item.name === 'Free'
                    ? <ImgWrapper className={tickIcon} alt='world' src='/img/slash.png'/>
                    : <ImgWrapper className={tickIcon} alt='world' src='/img/tick_icon.png'/>
              }
              <span className={rightText}>Email Scheduling</span>
            </div>
            <div className={rightItem}>
              {
                item.name === 'Free'
                    ? <ImgWrapper className={tickIcon} alt='world' src='/img/slash.png'/>
                    : <ImgWrapper className={tickIcon} alt='world' src='/img/tick_icon.png'/>
              }
              <span className={rightText}>Pre-built Email Templates</span>
            </div>
            <div className={rightItem}>
              {
                item.name === 'Free' || item.name === 'Essentials'
                    ? <ImgWrapper className={tickIcon} alt='world' src='/img/slash.png'/>
                    : <ImgWrapper className={tickIcon} alt='world' src='/img/tick_icon.png'/>
              }
              <span className={rightText}>Reporting & Analytics</span>
            </div>
            <div className={rightItem}>
              {
                item.name === 'Free' || item.name === 'Essentials'
                    ? <ImgWrapper className={tickIcon} alt='world' src='/img/slash.png'/>
                    : <ImgWrapper className={tickIcon} alt='world' src='/img/tick_icon.png'/>
              }
              <span className={rightText}>Send Time Optimization</span>
            </div>
            <div className={rightItem}>
              {
                item.name === 'Free' || item.name === 'Essentials'
                    ? <ImgWrapper className={tickIcon} alt='world' src='/img/slash.png'/>
                    : <ImgWrapper className={tickIcon} alt='world' src='/img/tick_icon.png'/>
              }
              <span className={rightText}>Content Optimizer</span>
            </div>
            <div className={rightItem}>
              {
                item.name !== 'Premium'
                    ? <ImgWrapper className={tickIcon} alt='world' src='/img/slash.png'/>
                    : <ImgWrapper className={tickIcon} alt='world' src='/img/tick_icon.png'/>
              }
              <span className={rightText}>Generative AI Features</span>
            </div>
            <div className={rightItem}>
              {
                item.name !== 'Premium'
                    ? <ImgWrapper className={tickIcon} alt='world' src='/img/slash.png'/>
                    : <ImgWrapper className={tickIcon} alt='world' src='/img/tick_icon.png'/>
              }
              <span className={rightText}>Big data support</span>
            </div>
            <div className={rightItem}>
              {
                item.name !== 'Premium'
                    ? <ImgWrapper className={tickIcon} alt='world' src='/img/slash.png'/>
                    : <ImgWrapper className={tickIcon} alt='world' src='/img/tick_icon.png'/>
              }
              <span className={rightText}>Dedicated IP</span>
            </div>
            <div className={rightItem}>
              {
                item.name !== 'Premium'
                    ? <ImgWrapper className={tickIcon} alt='world' src='/img/slash.png'/>
                    : <ImgWrapper className={tickIcon} alt='world' src='/img/tick_icon.png'/>
              }
              <span className={rightText}>Personalized Onboarding</span>
            </div>
          </div>
        </div>)
      }
    </div>
  </div>
};

export default PriceList;