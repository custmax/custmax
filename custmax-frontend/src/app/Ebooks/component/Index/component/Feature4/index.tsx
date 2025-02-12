'use client';
import ImgWrapper from '@/component/ImgWrapper';
import styles from './index.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import { Tooltip } from 'antd';

const {
  feature4Container,
  title,
  items,
  item,
  imgBox0,
  imgBox1,
  imgBox2,
  featureImg,
  text,
  subText,
  tooltip,
  link,
  signUp,
  signUpArrow,
  signText,
} = styles;

const Feature4 = () => {
  return <div className={classNames(feature4Container)}>
    <div className={title}>Unleash the power of AI to transform your global email marketing and reach new heights of success.</div>
    <div className={items}>
      <div className={classNames(item)}>
        <ImgWrapper
            className={imgBox0}
            imgClassName={featureImg}
            alt='powerful'
            src='/img/powerful1.png'
            sizes='100%'
            priority
        />
        <div className={text}>Powerful features</div>
        <div className={subText}>Our platform has everything you need to create and send successful email campaigns, regardless of your location or target audience.</div>
      </div>
      <div className={classNames(item)}>
        <ImgWrapper
            className={imgBox1}
            imgClassName={featureImg}
            alt='affordable'
            src='/img/affordable1.png'
            sizes='100%'
            priority
        />
        <div className={text}>Affordable pricing</div>
        <div className={subText}>Our plans are designed to fit any budget, so you can get started without breaking the bank.</div>
      </div>
      <div className={classNames(item)}>
        <ImgWrapper
            className={imgBox2}
            imgClassName={featureImg}
            alt='excellent'
            src='/img/excellent1.png'
            sizes='100%'
            priority
        />
        <div className={text}>Excellent support</div>
        <div className={subText}>Our team is here to help you every step of the way, with dedicated support for global customers.</div>
      </div>
    </div>
    <Tooltip
      placement="bottomLeft"
      className={tooltip}
      title={<div className='more'>
        Sign up for a free trial today and see how our email marketing platform can help you reach your business goals worldwide.
      </div>}
      getPopupContainer={() => document.querySelector('#feature4') || document.body}
    >
      <Link href='/signup' className={link}>
        <div className={signUp} id='feature4'>
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
  </div>
}

export default Feature4;