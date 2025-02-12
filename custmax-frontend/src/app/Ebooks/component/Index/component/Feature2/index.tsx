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
  signText,
  imgBg0,
  imgBg1,
} = styles;

const Feature2 = () => {
  return <div className={classNames(feature2Container)}>
    <div className={title}>Reach new customers and boost sales worldwide with our powerful email marketing tools.</div>
    <div className={subTitle}>
      <span className={label}>•<span style={{ paddingLeft: '1em' }} />Grow your audience: </span>
      <span className={value}>Build and segment your email lists with ease, no matter where your customers are located.</span>
    </div>
    <div className={subTitle}>
      <span className={label}>•<span style={{ paddingLeft: '1em' }} />Create engaging campaigns: </span>
      <span className={value}>Design beautiful and effective emails that get results, in any language.</span>
    </div>
    <div className={subTitle}>
      <span className={label}>•<span style={{ paddingLeft: '1em' }} />Track your performance: </span>
      <span className={value}>Get detailed insights into your email campaigns and optimize for global success.</span>
    </div>
    <Tooltip
      placement="bottomLeft"
      className={tooltip}
      title={<div className='more'>
        Sign up for a free trial today and see how our email marketing platform can help you reach your business goals worldwide.
      </div>}
      getPopupContainer={() => document.querySelector('#feature2') || document.body}
    >
      <Link className={link} href='/signup'>
        <div className={signUp} id='feature2'>
          <span className={signText}>
            Sign up for a free trial now
          </span>
          <ImgWrapper
              className={signUpArrow}
              alt='sign_up_arrow'
              src='/img/sign_up_arrow.png'
              sizes='100%'
              priority
          />
        </div>
      </Link>
    </Tooltip>
    <div className={imgBg0} />
    <ImgWrapper
        className={imgBg1}
        alt='worldwide'
        src='/img/worldwide.png'
        sizes='100%'
        priority
    />
  </div>
}

export default Feature2;