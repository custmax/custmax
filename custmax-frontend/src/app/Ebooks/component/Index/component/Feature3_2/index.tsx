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
    title2,
} = styles;

const Feature3_2 = () => {
  return <div className={classNames(feature2Container)}>

    <div className={title2}>Drive Customer Engagement</div>
    <div className={subTitle}>
      {/*<span className={label}>•<span style={{ paddingLeft: '1em' }} />Grow your audience: </span>*/}
      <span className={value}>Build lasting relationships with your customers through our platform. </span>
    </div>
    <div className={subTitle}>
      {/*<span className={label}>•<span style={{ paddingLeft: '1em' }} />Create engaging campaigns: </span>*/}
      <span className={value}>Nurture loyalty, increase brand awareness, and drive repeat business with targeted and engaging email communications.</span>
    </div>

    <div className={imgBg0}/>
    <ImgWrapper
        className={imgBg1}
        alt='worldwide'
        src='/img/feature3_2.png'
        sizes='100%'
        priority
    />
  </div>
}

export default Feature3_2;