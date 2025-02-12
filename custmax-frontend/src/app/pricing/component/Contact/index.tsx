import styles from './index.module.scss';
import classNames from 'classnames';
import Image from 'next/image';
import { PHONE } from '@/constant/cusob';

const {
  contactContainer,
  bannerBg,
  content,
  slogan,
  contactWay,
  sale,
  phone,
} = styles;

const Contact = () => {

  return <div className={contactContainer}>
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
        <span>Utilize professional migration services to transition to</span>
        <span>CusOb</span>
      </div>
      <div className={contactWay}>
        <div className={sale}>Talk to Sales</div>
        <div className={phone}>{PHONE}</div>
      </div>
    </div>
  </div>
};

export default Contact;