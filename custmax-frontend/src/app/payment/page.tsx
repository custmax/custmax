'use client'

import styles from './page.module.scss';
import Header from '@/component/Header';
import ImgWrapper from '@/component/ImgWrapper';
import { SUCCESS_CODE } from '@/constant/common';
import { Checkbox, Form, Input, Radio, RadioChangeEvent, Select, Space, message } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { countryOptions } from '@/constant/phone';
import { submitOrder } from '@/server/orderInfo';
import {getPlanById} from "@/server/price";
import PrefixSelector from "@/component/PrefixSelector";

import {countryOptionss} from "@/constant/country";




const selectOptions = countryOptions;
const CountryOptions = countryOptionss

const {
  paymentContainer,
  content,
  left,
  title,
  radioGroup,
  paymentIcon1,
  paymentIcon2,
  paymentForm1,
  nameBox,
  paymentFormExtra1,
  countryBox,
  billingTitle,
  checkBox,
  right,
  subTitle,
  planBox,
  planTitle,
  planItem,
  discountBox,
  discountTitle,
  discountItem,
  taxBox,
  totalBox,
  agreeCheckBox,
  payNow,
  payNowIcon,
  tip,
  learnMore,
  receiptBox,
} = styles;

const Payment = () => {
  const[accountForm] = Form.useForm()
  const[accountExtraForm] = Form.useForm()
  const[billForm] = Form.useForm()
  const[billExtraForm] = Form.useForm()
  const [radioValue, setRadioValue] = useState(1);
  const searchParams = useSearchParams()
  const planId = Number(searchParams.get('id'))
  const [plan, setPlan] = useState<Plan.PlanItem | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const [contactnum, setContactnum] = useState('')
  const [emailnum, setEmailnum] = useState('')


  const initPlan = useCallback(async () => {
    if (planId) {
      const res = await getPlanById(planId)
      if (res.code === SUCCESS_CODE) {
        setPlan(res.data)
        console.log(plan)

        const contactCapacityString = res.data?.contactCapacity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // @ts-ignore
        const contactCapacityLength = contactCapacityString.length;
        const insertPosition = contactCapacityLength - 3;
        // @ts-ignore
        setContactnum(`${contactCapacityString.slice(0, insertPosition)}${contactCapacityString.slice(insertPosition)}`)
// 这里假设您希望倒数第四个位置插入逗号
        const emailCapacityString = res.data?.emailCapacity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // @ts-ignore

        const emailCapacityLength = emailCapacityString.length;
        const position = emailCapacityLength - 3;
        // @ts-ignore
        setEmailnum(`${emailCapacityString.slice(0, position)}${emailCapacityString.slice(position)}`)


      }
    }
  }, [planId])

  const initForm = useCallback(() => {
    accountForm.setFieldValue('prefix', 'US +1')
    billForm.setFieldValue('billingPrefix', 'US +1')
  }, [accountForm, billForm])

  useEffect(() => {
    initPlan()
    initForm()
  }, [initPlan, initForm])

  const onRadioChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setRadioValue(e.target.value);
  };

  const onCountryChange = () => {};

  const onStateChange = () => {};

  const onBillAddressChange = (e: { target: { checked: boolean } }) => {
    if (e.target.checked) {
      setIsVisible(!isVisible)
      const {
        accountAddressLine1,
        accountAddressLine2,
        accountCity,
        accountCompany,
        accountEmail,
        accountFirstName,
        accountLastName,
        accountPhone,
      } = accountForm.getFieldsValue();
      const billFormValues = {
        billingAddressLine1: accountAddressLine1,
        billingAddressLine2: accountAddressLine2,
        billingCity: accountCity,
        billingCompany: accountCompany,
        billingEmail: accountEmail,
        billingFirstName: accountFirstName,
        billingLastName: accountLastName,
        billingPhone: accountPhone,
      }
      const { 
        accountCountry,
        accountState,
        accountZipCode,
      } = accountExtraForm.getFieldsValue();
      const billExtraFormValues = {
        billingState: accountState,
        billingZipCode: accountZipCode,
        billingCountry: accountCountry,
      }
      billForm.setFieldsValue(billFormValues)
      billExtraForm.setFieldsValue(billExtraFormValues)
    }else {
      setIsVisible(!isVisible)
    }
  };

  const onAgreeChange = (e: { target: { checked: boolean } }) => {
    setAgreed(e.target.checked)
  };



  const onPay = async () => {
    const {
      accountAddressLine1,
      accountAddressLine2,
      accountCity,
      accountCompany,
      accountEmail,
      accountFirstName,
      accountLastName,
      accountPhone,
      prefix,
    } = accountForm.getFieldsValue();
    console.log(accountPhone)
    const { 
      accountCountry,
      accountState,
      accountZipCode,
    } = accountExtraForm.getFieldsValue();
    const {
      billingAddressLine1,
      billingAddressLine2,
      billingCity,
      billingCompany,
      billingEmail,
      billingFirstName,
      billingLastName,
      billingPhone,
      billingPrefix,
    } = billForm.getFieldsValue();
    const {
      billingState,
      billingZipCode,
      billingCountry,
    } = billExtraForm.getFieldsValue();
    const data = {
      accountAddressLine1,
      accountAddressLine2,
      accountCity,
      accountCompany,
      accountEmail,
      accountFirstName,
      accountLastName,
      accountPhone: accountPhone==='' || accountPhone===undefined ? '': prefix.replace('+', '') + '-' + accountPhone,
      accountCountry,
      accountState,
      accountZipCode,
      billingAddressLine1,
      billingAddressLine2,
      billingCity,
      billingCompany,
      billingEmail,
      billingFirstName,
      billingLastName,
      // billingPhone: billingPrefix.replace('+', '') + '-' + billingPhone, todo
      billingPhone,
      billingState,
      billingZipCode,
      billingCountry,
      paymentMethod: 0,
    }
    const res = await submitOrder(data, String(planId))
    if (res.code === SUCCESS_CODE && res.data) {
      window.location.href = res.data
    } else {
      message.error(res.message)
    }
  }

  return <div className={paymentContainer}>
    <Header />
    <div className={content}>
      <div className={left}>
        <div className={title}>Payment Method</div>
        <Radio.Group className={radioGroup} onChange={onRadioChange} value={radioValue}>
          <Radio value={1}>
            <ImgWrapper className={paymentIcon2} alt='payment icon' src='/img/payment_icon_2.png'/>
          </Radio>
          <Radio value={2}>
            <ImgWrapper className={paymentIcon1} alt='payment icon' src='/img/payment_icon_1.png'/>
          </Radio>
        </Radio.Group>
        {/*<div className={title}>Contact address</div>*/}
        {/*<Form*/}
        {/*  form={accountForm}*/}
        {/*  name="paymentForm1"*/}
        {/*  className={paymentForm1}*/}
        {/*  labelAlign='left'*/}
        {/*  labelCol={{ span: 4 }}*/}
        {/*  wrapperCol={{ span: 20 }}*/}
        {/*  colon={false}*/}
        {/*>*/}
        {/*  <Space.Compact block size='large' className={nameBox}>*/}
        {/*    <Form.Item*/}
        {/*      label="First name"*/}
        {/*      name='accountFirstName'*/}
        {/*      labelCol={{ span: 9 }}*/}
        {/*      wrapperCol={{ span: 15 }}*/}
        {/*      rules={[{ required: true, message: 'Please input your first name!' }]}*/}
        {/*    >*/}
        {/*      <Input placeholder="Please input your first name" />*/}
        {/*    </Form.Item>*/}
        {/*    <Form.Item*/}
        {/*      label="last name"*/}
        {/*      name='accountLastName'*/}
        {/*      labelCol={{ span: 6 }}*/}
        {/*      wrapperCol={{ span: 18 }}*/}

        {/*    >*/}
        {/*      <Input placeholder="Please input your last name" />*/}
        {/*    </Form.Item>*/}
        {/*  </Space.Compact>*/}
        {/*  <Form.Item label="Address">*/}
        {/*    <Space.Compact block size='large' direction='vertical'>*/}
        {/*      <Form.Item*/}
        {/*        name='accountAddressLine1'*/}
        {/*        rules={[{ required: true, message: 'first address is required' }]}*/}
        {/*      >*/}
        {/*        <Input placeholder="Enter the street address" />*/}
        {/*      </Form.Item>*/}
        {/*      <Form.Item*/}
        {/*        name='accountAddressLine2'*/}
        {/*        rules={[{ required: true, message: 'second address is required' }]}*/}
        {/*      >*/}
        {/*        <Input placeholder="Apt, unit, suite (optional)" />*/}
        {/*      </Form.Item>*/}
        {/*    </Space.Compact>*/}
        {/*  </Form.Item>*/}
        {/*  <Form.Item label="State" name='accountState'>*/}
        {/*    <Input placeholder="State" />*/}
        {/*  </Form.Item>*/}
        {/*  <Form.Item label="City" name='accountCity'>*/}
        {/*    <Input placeholder="City" />*/}
        {/*  </Form.Item>*/}
        {/*  <Form.Item label="Company" name='accountCompany'>*/}
        {/*    <Input placeholder="Company" />*/}
        {/*  </Form.Item>*/}
        {/*  <Form.Item label="Email" name='accountEmail'>*/}
        {/*    <Input placeholder="Email" />*/}
        {/*  </Form.Item>*/}
        {/*  <Form.Item*/}
        {/*    label="Phone Number"*/}
        {/*    name='accountPhone'*/}
        {/*    labelCol={{ span: 5 }} // 标签占据的列数*/}
        {/*    wrapperCol={{ span: 20, offset: 1 }} // 控件占据的列数，并向右偏移2列以产生间距*/}
        {/*  >*/}
        {/*    <Input addonBefore=<PrefixSelector/> />*/}
        {/*  </Form.Item>*/}
        {/*</Form>*/}
        {/*<Form*/}
        {/*  form={accountExtraForm}*/}
        {/*  name='paymentFormExtra1'*/}
        {/*  className={paymentFormExtra1}*/}
        {/*  layout='vertical'*/}
        {/*>*/}
        {/*  <Space.Compact block size='large' className={countryBox}>*/}
        {/*    <Form.Item*/}
        {/*        name="accountCountry"*/}
        {/*        label="Country"*/}
        {/*    >*/}
        {/*      <Select*/}
        {/*          placeholder="Select a country"*/}
        {/*          options={CountryOptions}*/}
        {/*      />*/}
        {/*    </Form.Item>*/}

        {/*    <Form.Item*/}
        {/*      label="Zip code"*/}
        {/*      name='accountZipCode'*/}
        {/*    >*/}
        {/*      <Input placeholder="Please input your zip code" />*/}
        {/*    </Form.Item>*/}
        {/*  </Space.Compact>*/}
        {/*</Form>*/}
        {/*<div className={billingTitle}>Billing address</div>*/}
        {/*<Checkbox checked={!isVisible} className={checkBox} onChange={onBillAddressChange}>Same as contact address</Checkbox>*/}
        {/*{isVisible &&*/}
        {/*    <div>*/}
        {/*      <Form*/}
        {/*          form={billForm}*/}
        {/*          name="paymentForm2"*/}
        {/*          className={paymentForm1}*/}
        {/*          labelAlign='left'*/}
        {/*          labelCol={{ span: 4 }}*/}
        {/*          wrapperCol={{ span: 20 }}*/}
        {/*          colon={false}*/}
        {/*      >*/}
        {/*        <Space.Compact block size='large' className={nameBox}>*/}
        {/*          <Form.Item*/}
        {/*              label="First name"*/}
        {/*              name='billingFirstName'*/}
        {/*              labelCol={{ span: 9 }}*/}
        {/*              wrapperCol={{ span: 15 }}*/}
        {/*              rules={[{ required: true, message: 'Please input your first name!' }]}*/}
        {/*          >*/}
        {/*            <Input placeholder="Please input your first name" />*/}
        {/*          </Form.Item>*/}
        {/*          <Form.Item*/}
        {/*              label="last name"*/}
        {/*              name='billingLastName'*/}
        {/*              labelCol={{ span: 6 }}*/}
        {/*              wrapperCol={{ span: 18 }}*/}
        {/*          >*/}
        {/*            <Input placeholder="Please input your last name" />*/}
        {/*          </Form.Item>*/}
        {/*        </Space.Compact>*/}
        {/*        <Form.Item label="Address">*/}
        {/*          <Space.Compact block size='large' direction='vertical'>*/}
        {/*            <Form.Item*/}
        {/*                name='billingAddressLine1'*/}
        {/*                rules={[{ required: true, message: 'first address is required' }]}*/}
        {/*            >*/}
        {/*              <Input placeholder="Enter the street address" />*/}
        {/*            </Form.Item>*/}
        {/*            <Form.Item*/}
        {/*                name='billingAddressLine2'*/}
        {/*                rules={[{ required: true, message: 'second address is required' }]}*/}
        {/*            >*/}
        {/*              <Input placeholder="Apt, unit, suite (optional)" />*/}
        {/*            </Form.Item>*/}
        {/*          </Space.Compact>*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item label="State" name='billingState'>*/}
        {/*          <Input placeholder="State" />*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item label="City" name='billingCity'>*/}
        {/*          <Input placeholder="City" />*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item label="Company" name='billingCompany'>*/}
        {/*          <Input placeholder="Company" />*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item label="Email" name='billingEmail'>*/}
        {/*          <Input placeholder="Email" />*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item*/}
        {/*            label="Phone Number"*/}
        {/*            name='billingPhone'*/}
        {/*            labelCol={{ span: 5 }} // 标签占据的列数*/}
        {/*            wrapperCol={{ span: 20, offset: 1 }} // 控件占据的列数，并向右偏移2列以产生间距*/}
        {/*        >*/}
        {/*          <Input addonBefore=<PrefixSelector/> />*/}
        {/*        </Form.Item>*/}
        {/*      </Form>*/}
        {/*      <Form*/}
        {/*          form={billExtraForm}*/}
        {/*          name='paymentFormExtra2'*/}
        {/*          className={paymentFormExtra1}*/}
        {/*          layout='vertical'*/}
        {/*      >*/}
        {/*        <Space.Compact block size='large' className={countryBox}>*/}
        {/*          <Form.Item*/}
        {/*              name="billingCountry"*/}
        {/*              label="Country"*/}
        {/*          >*/}
        {/*            <Select*/}
        {/*                placeholder="Select a country"*/}
        {/*                options={CountryOptions}*/}
        {/*            />*/}
        {/*          </Form.Item>*/}
        {/*          <Form.Item*/}
        {/*              label="Zip code"*/}
        {/*              name='billingZipCode'*/}
        {/*          >*/}
        {/*            <Input placeholder="Please input your zip code" />*/}
        {/*          </Form.Item>*/}
        {/*        </Space.Compact>*/}
        {/*      </Form>*/}
        {/*    </div>*/}
        {/*}*/}
      </div>
      <div className={right}>
        <div className={title}>Purchase summary</div>
        <div className={subTitle}>
          <span style={{ color: '#666666' }}>Billed in </span>
          <span style={{ color: '#999999' }}>$ US Dollars</span>
        </div>
        <div className={planBox}>
          <div className={planTitle}>
            <span>{plan?.name} plan</span>
            <span>${plan?.priceUSD.toFixed(2)}</span>
          </div>
          <div className={planItem}>
            <span>{contactnum} contacts*</span>
            <span>per month</span>
          </div>
          <div className={planItem}>
            <span>{plan?.name === 'Premium'? 'Unlimited' : emailnum} email sends*</span>
          </div>
        </div>
        <div className={discountBox}>
          <div className={discountTitle}>
            <span>Discounts</span>
            <span style={{ color: '#5F6EA0' }}>${plan?.discountUSD.toFixed(2)}</span>
          </div>
          {/*<div className={discountItem}>*/}
          {/*  <span>1 Month Free Trial (100%)</span>*/}
          {/*</div>*/}
        </div>
        <div className={taxBox}>
          <span>Tax</span>
          <span>$0.00</span>
        </div>
        <div className={totalBox}>
          <span>Total</span>
          <span>${plan?.amountUSD.toFixed(2)}</span>
        </div>
        <div className={payNow} onClick={onPay}>
          <ImgWrapper className={payNowIcon} alt='payment icon' src='/img/pay_now_icon.png'/>
          <span>Pay now</span>
          </div>
        {/*<div className={tip}>* When you exceed your limit, you incur additional charges of $6.50/mo per additional 150 contacts (comes with additional1.800 email sends).</div>*/}
        {/*<div className={learnMore}>Learn more</div>*/}

      </div>
      
    </div>
  </div>
};

export default Payment;
