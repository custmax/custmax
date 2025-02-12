import ImgWrapper from '@/component/ImgWrapper';
import styles from './page.module.scss';
import Header from '@/component/Header';
import Link from 'next/link';

const {
  accountConfirmContainer,
  content,
  title,
  tip,
  accountBg,
  linkBox,
  nextStep
} = styles;

const AccountConfirm = () => {
  return <div className={accountConfirmContainer}>
    <Header />
    <div className={content}>
      <div className={title}>Account Confirmation</div>
      <div className={tip}>Verify your email address XXXX@CusOb.com to confirm your account and continue to access all CusOb services.</div>
      <ImgWrapper className={accountBg} alt='account_bg' src='/img/account_bg.png'/>
      <div className={linkBox}>
        <span>By clicking Verify, you agree to the</span>
        <span style={{ color: '#000AFF' }}>
          <Link href='/aboutCookies'> Terms of Service </Link>
        </span>
        <span>and</span>
        <span style={{ color: '#000AFF' }}>
         <Link href='/privacy'> Privacy Policy</Link>
        </span>
      </div>
      <Link href='/payment'>
        <div className={nextStep}>
          Next Step
        </div>
      </Link>
    </div>
  </div>
};

export default AccountConfirm;
