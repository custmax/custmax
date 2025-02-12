'use client'
import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import { Progress, message } from 'antd';
import ImgWrapper from '@/component/ImgWrapper';
import Link from 'next/link';
import { getPlanDetail } from '@/server/company';
import { SUCCESS_CODE } from '@/constant/common';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { paySuccess } from '@/server/payment';

const {
  dashboardContainer,
  main,
  title,
  content,
  planTitle,
  progressWrapper,
  progressBox,
  progressText,
  tip,
  view,
  quickActionWrapper,
  left,
  quickTitle,
  actionItem,
  circle,
  quickActionIcon,
  view2,
  func,
} = styles;

const Dashboard = () => {
  const [plan, setPlan] = useState<Plan.PlanShown | null>(null)
  const searchParams = useSearchParams()
  const PayerID = searchParams.get('PayerID')
  const paymentId = searchParams.get('paymentId')

  const initPlan = useCallback(async () => {
    const planRes = await getPlanDetail()
    if (planRes.code === SUCCESS_CODE) {
      setPlan(planRes.data)
    }
  }, [])

  const initPaySuccess = useCallback(async () => {
    if (PayerID && paymentId) {
      const res = await paySuccess(PayerID, paymentId)
      if (res.code === SUCCESS_CODE) {
        window.location.replace("/dashboard");
      } else {
        message.error(res.message)
      }
    }
  }, [PayerID, paymentId])
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    initPlan()
    initPaySuccess()
  }, [initPlan, initPaySuccess])


  return <div className={dashboardContainer}>
    <EnteredHeader />
    <SideBar />
    {/*侧边展示栏*/}
    <div className={main}>
      <div className={title}>
        <span>{plan?.planName} plan</span>
        <span>|</span>
        <Link href='./pricing' style={{ fontWeight: '600' }}>Upgrade</Link>
      </div>
      <div className={content}>
        <div className={planTitle}>{plan?.planName} plan</div>
        <div className={progressWrapper}>
          <div className={progressBox}>
            <div className={progressText}>
              <span>Contacts</span>
              <span>{plan?.contactCount} of {plan?.contactCapacity}</span>
            </div>
            <Progress percent={(plan?.contactCount || 0) / (plan?.contactCapacity || 0) * 100} showInfo={false} />
            <div className={tip}>{(plan?.contactCapacity || 0) - (plan?.contactCount || 0)} contacts remaining on your selected plan</div>
            <Link href='/contactList' className={view}>View Contacts</Link>
          </div>
          <div className={progressBox}>
            <div className={progressText}>
              <span>Sends</span>
              <span>{plan?.emailCount} of {plan?.emailCapacity}</span>
            </div>
            <Progress percent={(plan?.emailCount || 0) / (plan?.emailCapacity || 0) * 100} showInfo={false} />
            <div className={tip}>{(plan?.emailCapacity || 0) - (plan?.emailCount || 0)} sends remaining on your selected plan.</div>
            <Link href='/campaign' className={view2}>View Campaigns</Link>
          </div>
        </div>
        <div className={quickActionWrapper}>
          <div className={left}>
            <div className={quickTitle}>Quick actions</div>
            <div className={func}>
              <Link href='/contactEditor' className={actionItem}>
                {/*<div className={circle}></div>*/}
                <span>Add contacts</span>
              </Link>
              <Link href='/campaignEditor' className={actionItem}>
                {/*<div className={circle}></div>*/}
                <span>Create a campaign</span>
              </Link>
              <Link href='/emailTemplates' className={actionItem}>
                {/*<div className={circle}></div>*/}
                <span>Email template</span>
              </Link>
              <Link href='/addSender' className={actionItem}>
                {/*<div className={circle}></div>*/}
                <span>Add sender</span>
              </Link>
              <Link href='/userList' className={actionItem}>
                {/*<div className={circle}></div>*/}
                <span>Invite your team</span>
              </Link>
            </div>
          </div>
          {/*<ImgWrapper className={quickActionIcon} src='/img/quick_action_icon.png' alt='quick_action_icon' />*/}
        </div>
      </div>
    </div>
  </div>
};

export default Dashboard;
