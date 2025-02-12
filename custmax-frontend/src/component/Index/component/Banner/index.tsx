import styles from './index.module.scss';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

const {
  bannerContainer,
  bannerBg,
  content,
  slogan,
  signUp,
} = styles;

const Banner = () => {
  return <div className={classNames(bannerContainer)}>
    <Image
      fill
      className={classNames(bannerBg)}
      alt='banner_bg'
      src='/img/banner_bg.png'
      sizes='100%'
      priority
    />
    <div className={classNames(content)}>
      <div className={classNames(slogan)}>Forge relationships through engagement marketing tools powered by AI. Leverage your data to execute personalized campaigns efficiently and elevate customer lifetime value.</div>
      <Link href='/signup'>
        <div className={classNames(signUp)}>
          Sign up for a free trial now
        </div>
      </Link>
    </div>
  </div>
};

export default Banner;