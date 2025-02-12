'use client';
import ImgWrapper from '@/component/ImgWrapper';
import styles from './index.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import { Tooltip } from 'antd';


const {
  feature3Container,
  main,
  nextLevelBg,
  contentBox,
  title,
  tooltip,
  link,
  subTitleBox,
  subTitle,
  label,
  value,
  signUp,
  imgBg0,
  imgBg1,
} = styles;

const Feature3 = () => {
  return <div className={classNames(feature3Container)}>
    <div className={main}>
      <ImgWrapper
        className={nextLevelBg}
        alt='next_level_bg'
        src='/img/next_level_bg.png'
        sizes='100%'
        priority
      />
      <div className={contentBox}>
        <div className={title}>Take your email marketing to the next level with our easy-to-use platform, designed for global success.</div>
        <Tooltip
          placement="bottomRight"
          className={tooltip}
          title={<div className='more'>
            Sign up for a free trial today and see how our email marketing platform can help you reach your business goals worldwide.
          </div>}
          getPopupContainer={() => document.querySelector('#feature3') || document.body}
        >
          <Link className={link} href='/signup'>
            <div className={signUp} id='feature3'>
              Sign up for a free trial now
            </div>
          </Link>
        </Tooltip>
      </div>
    </div>
    <div className={subTitleBox}>
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
    </div>
    <div className={imgBg0} />
    <ImgWrapper
        className={imgBg1}
        alt='next_level'
        src='/img/next_level.png'
        sizes='100%'
        priority
    />
  </div>
}

export default Feature3;