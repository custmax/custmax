import styles from './index.module.scss';
import classNames from 'classnames';
import Image from 'next/image';

const {
  bannerContainer,
  bannerBg,
  content,
  slogan,
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
      <div className={classNames(slogan)}>
        <span>Leave us a message</span>
        <span>Submit your requirements here, and we will get in touch with you shortly.</span>
      </div>
    </div>
  </div>
};

export default Banner;