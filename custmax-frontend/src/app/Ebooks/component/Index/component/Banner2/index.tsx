'use client';
import ImgWrapper from '@/component/ImgWrapper';
import styles from './index.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import { Tooltip } from 'antd';
import {getLocalUser, getToken} from "@/util/storage";
import {useEffect, useState} from "react";


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

const Banner2 = () => {
  const [token, setToken] = useState("")
  const initToken = () => {
    setToken(getToken())
  }

  // Effect hook to initialize token and local user information on component mount
  useEffect(() => {//useEffect是一个副作用钩子，用于在组件挂载时初始化token和local user信息
    initToken()//初始化token
    initLocal();//初始化local user信息
  }, []);
  const initLocal = () => {
    const localUser = getLocalUser() || {}//从localStorage中获取localUser，如果没有则为空对象

  }
  return <div className={classNames(feature2Container)}>
    <div className={title}>Try Cusob Email Marketing for Free.</div>
    <div className={subTitle}>
      {/*<span className={label}>•<span style={{ paddingLeft: '1em' }} />Grow your audience: </span>*/}
      <span className={value}>Empower your business with our advanced email marketing platform for effective audience targeting and engaging campaigns.</span>
    </div>
    <div className={subTitle}>
      {/*<span className={label}>•<span style={{ paddingLeft: '1em' }} />Create engaging campaigns: </span>*/}
      <span className={value}>Take your marketing to the next level and thrive with our intuitive tools and expert guidance.</span>
    </div>
    {/*<div className={subTitle}>*/}
    {/*  <span className={label}>•<span style={{ paddingLeft: '1em' }} />Track your performance: </span>*/}
    {/*  <span className={value}>Get detailed insights into your email campaigns and optimize for global success.</span>*/}
    {/*</div>*/}
    <Tooltip
      placement="bottomLeft"
      className={tooltip}

      getPopupContainer={() => document.querySelector('#feature2') || document.body}
    >
      {
        token ? <Link className={link} href='/dashboard'>
          <div className={signUp} id='feature2'>
            <span className={signText}>
              Get started
            </span>
          </div>
        </Link> : <Link className={link} href='/signup'>
          <div className={signUp} id='feature2'>
            <span className={signText}>
              Get started
            </span>
          </div>
        </Link>
      }
      {/*<Link className={link} href='/signup'>*/}
      {/*  <div className={signUp} id='feature2'>*/}
      {/*    <span className={signText}>*/}
      {/*      Get started*/}
      {/*    </span>*/}
      {/*  </div>*/}
      {/*</Link>*/}
      <Link className={link} href='/bookDemo'>
        <div className={bookDemo} id='feature2'>
          <span className={bookDemoText}>
            Watch demos
          </span>
        </div>
      </Link>
    </Tooltip>
    <div className={imgBg0} />
    <ImgWrapper
        className={imgBg1}
        alt='worldwide'
        src='/img/bannerimg.png'
        sizes='100%'
        priority
    />
  </div>
}

export default Banner2;