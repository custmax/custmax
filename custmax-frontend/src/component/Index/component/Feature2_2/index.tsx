'use client';
import ImgWrapper from '@/component/ImgWrapper';
import styles from './index.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import { Tooltip } from 'antd';


const {
  feature2Container,
  title,
  subTitle,
  tooltip,
  link,
  label,
  value,
  signUp,
  signUpArrow,
  bookDemo,
  bookDemoArrow,
  bookDemoText,
  signText,
  imgBg0,
  imgBg1,
} = styles;

const Feature2_2 = () => {
  return <div className={classNames(feature2Container)}>
    <div className={imgBg0}/>
    <ImgWrapper
        className={imgBg1}
        alt='worldwide'
        src='/img/feature2_2.png'
        sizes='100%'
        priority
    />
    <div className={title}>Harness Data for Success</div>
    <div className={subTitle}>
      {/*<span className={label}>•<span style={{ paddingLeft: '1em' }} />Grow your audience: </span>*/}
      <span className={value}>Leverage our powerful data analytics tools to personalize your campaigns and target the right audience effectively.</span>
    </div>
    <div className={subTitle}>
      {/*<span className={label}>•<span style={{ paddingLeft: '1em' }} />Create engaging campaigns: </span>*/}
      <span className={value}>Use insights to optimize your strategies and achieve better results.</span>
    </div>
    {/*<div className={subTitle}>*/}
    {/*  <span className={label}>•<span style={{ paddingLeft: '1em' }} />Track your performance: </span>*/}
    {/*  <span className={value}>Get detailed insights into your email campaigns and optimize for global success.</span>*/}
    {/*</div>*/}


  </div>
}

export default Feature2_2;