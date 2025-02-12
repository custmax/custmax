'use client'
import { useCallback, useEffect, useState } from 'react';
import styles from './page.module.scss';
import EnteredHeader from '@/component/EnteredHeader';
import { getAccountInfo, saveAccountInfo, updateAccountInfo } from '@/server/accountInfo';
import { SUCCESS_CODE } from '@/constant/common';
import { message } from 'antd';
import AccountModal from './component/AccountModal';
import { getBillingInfo, saveBillingInfo, updateBillingInfo } from '@/server/billingInfo';
import BillingModal from './component/BillingModal';
import {useRouter, useSearchParams} from "next/navigation";
import {router} from "next/client";

const {
  contactInfoContainer,
  main,
  primaryTitle,
  title,
  primaryInfo,
  content,
  primaryItem,
  label,
  value,
  editBtn
} = styles;

const ContactInfo = () => {
  const searchParams = useSearchParams()
  const [accountInfo, setAccountInfo] = useState<Info.AccountInfo | null>(null)
  const [billingInfo, setBillingInfo] = useState<Info.AccountInfo | null>(null)
  const [showAccountModal, setShowAccountModal] = useState(!!searchParams.get('form'))
  const [showBillingModal, setShowBillingModal] = useState(false)
  const router = useRouter();


  const initAccountInfo = useCallback(async () => {
    message.loading({ content: 'loading', duration: 10, key: 'loading' })
    const res = await getAccountInfo()
    message.destroy('loading')
    if (res.code === SUCCESS_CODE) {
      setAccountInfo(res.data)
    } else {
      message.error(res.message)
    }
  }, [])
  

  const initBillingInfo = useCallback(async () => {
    message.loading({ content: 'loading', duration: 10, key: 'loading' })
    const res = await getBillingInfo()
    message.destroy('loading')
    if (res.code === SUCCESS_CODE) {
      setBillingInfo(res.data)
    } else {
      message.error(res.message)
    }
  }, [])

  useEffect(() => {
    initAccountInfo()
    initBillingInfo()
  }, [initAccountInfo, initBillingInfo])

  const onAccountOk = async (values: Info.AccountInfo) => {
    if (accountInfo) {
      const res = await updateAccountInfo(values)
      if (res.code === SUCCESS_CODE) {
        message.success(res.message, initAccountInfo)
        if(!!searchParams.get('form')){
          router.push('/campaign')
        }
      } else {
        message.error(res.message)
      }
    } else {
      const res = await saveAccountInfo(values)
      if (res.code === SUCCESS_CODE) {
        message.success(res.message, initAccountInfo)
        if(!!searchParams.get('form')){
          router.push('/campaign')
        }
      } else {
        message.error(res.message)
      }
    }
    setShowAccountModal(false)
  }

  const onAccountCancel = () => {
    setShowAccountModal(false)
  }

  const onBillingOk = async (values: Info.AccountInfo) => {
    if (billingInfo) {
      const res = await updateBillingInfo(values)
      if (res.code === SUCCESS_CODE) {
        message.success(res.message, initBillingInfo)
      } else {
        message.error(res.message)
      }
    } else {
      const res = await saveBillingInfo(values)
      if (res.code === SUCCESS_CODE) {
        message.success(res.message, initBillingInfo)
      } else {
        message.error(res.message)
      }
    }
    setShowBillingModal(false)
  }

  const onBillingCancel = () => {
    setShowBillingModal(false)
  }

  return <div className={contactInfoContainer}>
    <EnteredHeader />
    <div className={main}>
      <div className={primaryTitle}>
        <div className={title}>Primary account contact</div>
        <div className={primaryInfo}>Information about this account, such as campaign send notifications, will besent to the email address listed here</div>
      </div>
      <div className={content}>
        <div className={primaryItem}>
          <div className={label}>Contact name</div>
          <div className={value}>{accountInfo?.firstName} {accountInfo?.lastName}</div>
        </div>
        <div className={primaryItem}>
          <div className={label}>Company/Organization</div>
          <div className={value}>{accountInfo?.company}</div>
        </div>
        <div className={primaryItem}>
          <div className={label}>Address</div>
          <div className={value}>{accountInfo?.addressLine1} {accountInfo?.addressLine2}</div>
        </div>
        <div className={primaryItem}>
          <div className={label}>Phone</div>
          <div className={value}>{accountInfo?.phone || 'No phone number provided'}</div>
        </div>
        <div className={primaryItem}>
          <div className={label}>Email</div>
          <div className={value} style={{ color: '#000AFF' }}>{accountInfo?.email}</div>
        </div>
        <div className={primaryItem}>
          <div className={label}>Tax lD</div>
          <div className={value}>{accountInfo?.taxId}</div>
        </div>
      </div>
      <div onClick={() => setShowAccountModal(true)} className={editBtn}>Edit Contact Information</div>
      <div className={primaryTitle}>
        <div className={title}>Billing info</div>
        <div className={primaryInfo}>This is the information we have associated with your payment method.</div>
      </div>
      <div className={content}>
        <div className={primaryItem}>
            <div className={label}>Contact name</div>
            <div className={value}>{billingInfo?.firstName} {billingInfo?.lastName}</div>
        </div>
        <div className={primaryItem}>
          <div className={label}>Company/Organization</div>
          <div className={value}>{billingInfo?.company}</div>
        </div>
        <div className={primaryItem}>
          <div className={label}>Address</div>
          <div className={value}>{billingInfo?.addressLine1} {billingInfo?.addressLine2}</div>
        </div>
        <div className={primaryItem}>
          <div className={label}>Phone</div>
          <div className={value}>{billingInfo?.phone || 'No phone number provided'}</div>
        </div>
        <div className={primaryItem}>
          <div className={label}>Email</div>
          <div className={value} style={{ color: '#000AFF' }}>{billingInfo?.email}</div>
        </div>
      </div>
      <div onClick={() => setShowBillingModal(true)} className={editBtn}>Edit Contact Information</div>
    </div>
    <AccountModal
      visible={showAccountModal}
      onOk={onAccountOk}
      onCancel={onAccountCancel}
      values={accountInfo}
    />
    <BillingModal
      visible={showBillingModal}
      onOk={onBillingOk}
      onCancel={onBillingCancel}
      values={billingInfo}
    />
  </div>
};

export default ContactInfo;
