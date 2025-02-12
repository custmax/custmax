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

const Feature1_2 = () => {
  return <div className={classNames(feature2Container)}>
    <div className={title}>Boost Your Business with Our Email Marketing Platform!</div>

    <div className={title2}> Create Stunning Campaigns</div>
    <div className={subTitle}>
      {/*<span className={label}>•<span style={{ paddingLeft: '1em' }} />Grow your audience: </span>*/}
      <span className={value}>Our platform empowers you to design eye-catching email campaigns easily.</span>
    </div>
    <div className={subTitle}>
      {/*<span className={label}>•<span style={{ paddingLeft: '1em' }} />Create engaging campaigns: </span>*/}
      <span className={value}>Engage your audience and drive sales with compelling content and beautiful designs.</span>
    </div>
    {/*<div className={subTitle}>*/}
    {/*  <span className={label}>•<span style={{ paddingLeft: '1em' }} />Track your performance: </span>*/}
    {/*  <span className={value}>Get detailed insights into your email campaigns and optimize for global success.</span>*/}
    {/*</div>*/}
    {/*<Tooltip*/}
    {/*    placement="bottomLeft"*/}
    {/*    className={tooltip}*/}

    {/*    getPopupContainer={() => document.querySelector('#feature2') || document.body}*/}
    {/*>*/}
    {/*  <Link className={link} href='/signup'>*/}
    {/*    <div className={signUp} id='feature2'>*/}
    {/*      <span className={signText}>*/}
    {/*        Get started*/}
    {/*      </span>*/}
    {/*    </div>*/}
    {/*  </Link>*/}
    {/*  <Link className={link} href='/bookDemo'>*/}
    {/*    <div className={bookDemo} id='feature2'>*/}
    {/*      <span className={bookDemoText}>*/}
    {/*        Watch demos*/}
    {/*      </span>*/}
    {/*    </div>*/}
    {/*  </Link>*/}
    {/*</Tooltip>*/}
    <div className={imgBg0}/>
    <ImgWrapper
        className={imgBg1}
        alt='worldwide'
        src='/img/feature1_2.png'
        sizes='100%'
        priority
    />
  </div>
}

export default Feature1_2;