import styles from './index.module.scss';
import ImgWrapper from '../ImgWrapper';
import {FC, MouseEventHandler, useCallback, useEffect, useState} from 'react';
import { getCaptcha } from '@/server/captcha';
import {message} from "antd";
import {SUCCESS_CODE} from "@/constant/common";


type Props = {
  setCode: (code:string) => void,
}

const {
  captcha,
  imgCaptcha,
} = styles;

const Captcha = (props: Props) => {

  const [captchaImg, setCaptchaImg] = useState('')

  const initCaptcha = useCallback(async () => {
    message.loading({content: 'loading', duration: 10, key: 'loading'})
    const res = await getCaptcha()
    message.destroy('loading')
    if (res.code === SUCCESS_CODE && res.data) {
      setCaptchaImg(res.data.img)
      props.setCode(res.data.captcha)
    } else {
      message.error(res.error)
    }
  }, [])

  useEffect(()=>{
    initCaptcha()
  }, [])

  return <div onClick={initCaptcha} className={captcha}>
    <ImgWrapper className={imgCaptcha} src={'data:image/png;base64,' + captchaImg} alt="captcha"></ImgWrapper>
  </div>
};

export default Captcha;