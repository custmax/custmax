'use client'
import styles from './page.module.scss';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import Index from "@/component/Index";
import {useEffect, useState} from "react";
import {router} from "next/client";
import Link from "next/link";
const {
  homeContainer,
  cookiecontainer,
  cookiealert,
  cookietext,
  buttons_container,
  button_gray,
  button_black
} = styles;

const COOKIE_ACCEPT_KEY = 'cookie_accept';


const Home = () => {

  const [isShown, setIsShown] = useState<boolean>(true);

  useEffect(() => {
    // 从 localStorage 中读取保存的状态
    const storedIsAccept = localStorage.getItem(COOKIE_ACCEPT_KEY);
    if (storedIsAccept !== null) {
      setIsShown(false);
    }
  }, []);

  const handleAccept = () => {
    setIsShown(false);
    // 更新状态并存储到 localStorage 中
    localStorage.setItem(COOKIE_ACCEPT_KEY, 'true');
  };

  const handleDeclineAll = () => {
    setIsShown(false);
    // 更新状态并存储到 localStorage 中
    localStorage.setItem(COOKIE_ACCEPT_KEY, 'false');
  };


  return <div className={homeContainer}>

    <Header showBar showSign />
    <Index />
    <Footer />
    {isShown && <div className={cookiecontainer}>
          <div className={cookiealert}>
            <p className={cookietext}>This site uses cookies and related technologies, as described in our privacy policy, for purposes that may include site
              operation, analytics, enhanced user experience, or advertising. You may choose to consent to our use of these technologies, or manage your own preferences

            </p>
            <div className={buttons_container}>
            <button className={button_gray}>ManageSettings</button>
            <button onClick={handleAccept}>Accept</button>
            <button  onClick={handleDeclineAll}>Decline All</button>
              <Link href="/policy"><button className={button_black} >Privacy Policy</button></Link>
            </div>

          </div>
    </div>
    }
  </div>
};
export default Home;
