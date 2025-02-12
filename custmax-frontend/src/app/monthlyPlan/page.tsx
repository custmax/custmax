'use client'
import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import { Progress } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getPlanDetail } from '@/server/company';
import { SUCCESS_CODE } from '@/constant/common';

const {
  monthlyPlanContainer,
  main,
  left,
  titleBox,
  extra,
  marketText,
  changeBtn,
  per,
  progressBox,
  progressText,
  tip,
  right,
  upcomingBox,
  upcomingTitle,
  upcomingTip,
  detailBox,
  detailStrong,
  detailPer,
} = styles;

const MonthlyPlan = () => {
  const [plan, setPlan] = useState<Plan.PlanShown | null>(null)

  const initPlan = useCallback(async () => {
    const planRes = await getPlanDetail()
    if (planRes.code === SUCCESS_CODE) {
      setPlan(planRes.data)
    }
  }, [])

  useEffect(() => {
    initPlan()
  }, [initPlan])
  

  return <div className={monthlyPlanContainer}>
    <EnteredHeader />
    <div className={main}>
      <div className={left}>
        <div className={titleBox}>
          <div>
            <div className={extra}>{plan?.planName}</div>
            <div className={marketText}>Marketing Plan</div>
          </div>
          <div className={changeBtn}>Change Plan</div>
        </div>
        <div className={per}>
          <span>$</span>
          <span>0</span>
          <span>per month</span>
        </div>
        <div className={progressBox}>
          <div className={progressText}>
            <span>Contacts</span>
            <span>{plan?.contactCount} of {plan?.contactCapacity}</span>
          </div>
          <Progress percent={(plan?.contactCount || 0) / (plan?.contactCapacity || 0) * 100} showInfo={false} />
          <div className={tip}>{(plan?.contactCapacity || 0) - (plan?.contactCount || 0)} remaining</div>
        </div>
        <div className={progressBox}>
          <div className={progressText}>
            <span>Email Sends</span>
            <span>{plan?.emailCount} of {plan?.emailCapacity}</span>
          </div>
          <Progress percent={(plan?.emailCount || 0) / (plan?.emailCapacity || 0) * 100} showInfo={false} />
          <div className={tip}>{(plan?.emailCapacity || 0) - (plan?.emailCount || 0)} remaining</div>
        </div>
      </div>
      <div className={right}>
        <div className={upcomingBox}>
          <div className={upcomingTitle}>No upcoming bill</div>
          <div className={upcomingTip}>You&#39;re on a Marketing Free plan, so you don&#39;t have any upcomingcharges</div>
        </div>
        <div className={detailBox}>
          <div className={detailStrong}>
            <span>Free plan</span>
            <span>$0.00</span>
          </div>
          <div className={detailPer}>
            <span>500 contacts*</span>
            <span>per month</span>
          </div>
          <div className={detailPer}>
            <span>1,000 email sends*</span>
          </div>
          <div className={detailStrong}>
            <span>Tax</span>
            <span>$0.00</span>
          </div>
        </div>
        <div className={detailBox}>
          <div className={detailStrong}>
            <span>Estimated Total</span>
            <span>$0.00</span>
          </div>
          <div className={detailPer}>
            <span>Autopay on Mar 4, 2024</span>
          </div>
        </div>
      </div>
    </div>
  </div>
};

export default MonthlyPlan;
