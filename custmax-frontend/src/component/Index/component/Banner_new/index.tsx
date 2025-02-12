import styles from './index.module.scss';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

const {
  bannerContainer,
  left,
  right,
  left_1,
  left_2 ,
  left_3,
  left_3_1,
  left_3_2,

  bannerBg,
  content,
  slogan,
  signUp,
} = styles;

const BannerNew = () => {
  return <div className={classNames(bannerContainer)}>
    {/*<Image*/}
    {/*  fill*/}
    {/*  className={classNames(bannerBg)}*/}
    {/*  alt='banner_bg'*/}
    {/*  src='/img/banner_bg.png'*/}
    {/*  sizes='100%'*/}
    {/*  priority*/}
    {/*/>*/}
    {/*<div className={classNames(content)}>*/}
    {/*  <div className={classNames(slogan)}>Forge relationships through engagement marketing tools powered by AI. Leverage your data to execute personalized campaigns efficiently and elevate customer lifetime value.</div>*/}
    {/*  <Link href='/signup'>*/}
    {/*    <div className={classNames(signUp)}>*/}
    {/*      Sign up for a free trial now*/}
    {/*    </div>*/}
    {/*  </Link>*/}
    {/*</div>*/}
    <div className={classNames(left)}>
      <div className={classNames(left_1)}>
        Try Cusob Email Marketing for Free.
      </div>
      <div className={classNames(left_2)}>
        Empower your business with our advanced email marketing platform for effective audience targeting and engaging campaigns. Take your marketing to the next level and thrive with our intuitive tools and expert guidance.
      </div>
      <div className={classNames(left_3)}>
        <Link href='/signup'>
          <div className={classNames(left_3_1)}>
            <div>
              Get started
            </div>

          </div>
        </Link>
        <Link href='/signup'>
          <div className={classNames(left_3_2)}>
            <div>
              Watch demos
            </div>
          </div>
        </Link>
      </div>


    </div>
    <div className={classNames(right)}>
      {/*<Image*/}
      {/*  fill*/}
      {/*  //className={classNames(bannerBg)}*/}
      {/*  alt='banner_bg'*/}
      {/*  src='/img/banner_bg.png'*/}
      {/*  sizes='100%'*/}
      {/*  priority*/}
      {/*/>*/}
      test
    </div>
  </div>
};

export default BannerNew;