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

const Banner2 = () => {
  return <div className={classNames(feature2Container)}>

    <div className={title2}>Schedule Your Personalized Demo Now!</div>
    <div className={subTitle}>
      {/*<span className={label}>•<span style={{ paddingLeft: '1em' }} />Grow your audience: </span>*/}
      <span className={value}>Discover the Power of Our Email Marketing Platform. Book a Demo Today and Explore How We Can Elevate Your Marketing Strategy to New Heights!</span>
    </div>

    <div className={imgBg0}/>
    <ImgWrapper
        className={imgBg1}
        alt='worldwide'
        src='/img/bookd.png'
        sizes='100%'
        priority
    />
  </div>
}

export default Banner2;