'use client'
import ImgWrapper from '@/component/ImgWrapper';
import styles from './page.module.scss';
import { Button, Checkbox, Form, Input, message } from 'antd';
import Link from 'next/link';
import ForgotPwModal from '@/component/ForgotPwModal';
import { useEffect, useState } from 'react';
import { login } from '@/server/user';
import { SUCCESS_CODE } from '@/constant/common';
import { useRouter } from 'next/navigation';
import {getLocalUser, getToken, setLocalUser, setToken} from '@/util/storage';
import {Navigate} from "react-router";
import classNames from "classnames";
import Image from "next/image";

const {
  loginWrapper,
  loginBg,
  loginBox,
  title,
  loginForm,
  forgotBox,
  forgotBtn,
  header,
    log,
  logoBox,
  logo,
    right,
    word,
    down,
    content,
    text,
  signupBtn
} = styles;


const Login = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [showForgotPw, setShowForgotPw] = useState<boolean>(false);
  useEffect(() => {
    if(getToken()){
      router.push("/dashboard")
    }
    initEmail()
  }, [])
  
  const initEmail = () => {
    const localUser = getLocalUser() || {}
    if (localUser.email) {
      form.setFieldValue('email', localUser.email)
    }
  }

  const onForgotPwOk = () => {
    setShowForgotPw(false)
  }

  const onForgotPwCancel = () => {
    setShowForgotPw(false)
  }

  const onFinish = async (value: Pick<User.UserSign, 'email' | 'password'> & { remember?: boolean }) => {
    if (value.remember) {
      setLocalUser({ email: value.email })
    } else {
      setLocalUser({ email: '' })
    }
    delete value.remember
    message.loading({ content: 'Loading...', duration: 10, key: 'loading' })
    const res = await login(value)
    message.destroy('loading')
    if (res.code === SUCCESS_CODE) {
      const { token = '', firstName = '', lastName = '', avatar = '', id } = res?.data || {}
      console.log("token=>",token)

      setToken(token)
      setLocalUser({ firstName, lastName, avatar, id })
      message.success({
        content: 'log in successfully!',
        onClose: () => {
          router.push('/dashboard')
        }
      })
    } else {
      message.error({ content: res.message })
    }

  }

  return <>
    <div className={loginWrapper}>

      <div className={header}>
        <Link href='/'>
          <div className={classNames(logoBox)}>
            <Image
                fill
                className={classNames(logo)}
                alt='logo'
                src='/img/logo.png'
                sizes='100%'
                priority
            />
          </div>
        </Link>
        <div className={right}>
          <Link href='/signup'>Sign Up</Link>
        </div>
      </div>
      <div className={down}>
        <div className={content}>
          <div className={word}>
            <h1>Log in</h1>
          </div>
          <div className={loginBox}>
            <Form
                form={form}
                layout="vertical"
                className={loginForm}
                onFinish={onFinish}
            >
              <Form.Item
                  className={text}
                  name='email'
                  rules={[{required: true, message: 'Please input your Email address!'}]}
              >
                <Input style={{
                  // width: '80vpx',
                  // //borderColor: '#7241FF', // 设置边框颜色
                  // borderRadius: '24px',    // 设置圆角效果
                  // //padding: '8px',
                  // marginLeft:'100vpx',
                  // paddingLeft:'20px',// 可选：增加内边距以增强视觉效果
                  // fontSize:'24px',
                  //backgroundColor:'#F5F5F5',
                }}placeholder="Email"/>
              </Form.Item>
              <Form.Item
                  className={text}
                  name='password'
                  rules={[{required: true, message: 'Please input your Password!'}]}
              >
                <Input style={{
                  // width: '80vpx',
                  // //borderColor: '#7241FF', // 设置边框颜色
                  // borderRadius: '24px',    // 设置圆角效果
                  // //padding: '8px',
                  // paddingLeft:'20px',// 可选：增加内边距以增强视觉效果
                  // fontSize:'24px',
                }}type='password' placeholder="Password"/>
              </Form.Item>
              <Form.Item label="" name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Form.Item className={log}>
                <Button   type="primary" htmlType='submit'>Log in</Button>
              </Form.Item>
            </Form>
            <div className={forgotBox}>
              <div className={forgotBtn} onClick={() => setShowForgotPw(true)}>Forgot password?</div>
              <div className={signupBtn}>
                <Link href='/signup'>Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ForgotPwModal
          visible={showForgotPw}
          onOk={onForgotPwOk}
          onCancel={onForgotPwCancel}
      />
    </div>
  </>

};

export default Login;