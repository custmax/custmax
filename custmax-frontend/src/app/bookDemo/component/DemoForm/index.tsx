'use client'

import { saveBook } from '@/server/book';
import styles from './index.module.scss';
import {Form, type FormProps, Input, Button, message, Space} from 'antd';
import { SUCCESS_CODE } from '@/constant/common';
import { useCallback, useEffect, useState} from 'react';
import {getCaptcha} from '@/server/captcha';
import Captcha from "@/component/Captcha";
import Turnstile from "@/component/Turnstile";

const {
  formContainer,
  formBox,
  formWrapper,
  submitBtn,
} = styles;

type FieldType = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  captcha?: string;
};

const DemoForm = () => {
  const [form] = Form.useForm()
  const [captchaCode, setCaptchaCode] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const shouldReload = searchParams.get('reload') === 'true';
    if (shouldReload) {
      window.location.replace('/bookDemo');
    }
  }, []);

  const onTurnstileVerify = (token: string) => {
    setTurnstileToken(token);
  };
  const setCode = (code:string) => {
    setCaptchaCode(code)
  }

  const onFinish: FormProps<FieldType>["onFinish"] = async (value: Record<string, string> ) => {
    if (!turnstileToken) {
      message.warning("Please complete the Turnstile verification!")
    }else {
      message.loading({ content: 'loading', duration: 10, key: 'loading' })
      console.log(value)
      const res = await saveBook({...value,turnstileToken})
      message.destroy('loading')
      if (res.code === SUCCESS_CODE) {
        message.success(res.message, () => {
          form.resetFields()
        })
      } else {
        message.error({ content: res.message })
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = () => {};

  return <div className={formContainer}>
    <div className={formBox}>
      <Form
        form={form}
        className={formWrapper}
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
            label={<span style={{ fontSize: '20px', fontFamily: 'Arial, sans-serif' }}>Name</span>}
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input
              style={{
                //backgroundColor: 'yellow',
                borderColor: '#7241FF', // 边框颜色
                borderWidth: '2px', // 边框宽度
                opacity: '0.5', // 透明度
                borderRadius: '8px' ,   // 圆角效果
                fontSize: '20px',
              }}
          />
        </Form.Item>
        <Form.Item<FieldType>
            label={<span style={{ fontSize: '20px', fontFamily: 'Arial, sans-serif' }}>Phone</span>}
          name="phone"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input
              style={{
                //backgroundColor: 'yellow',
                borderColor: '#7241FF', // 边框颜色
                borderWidth: '2px', // 边框宽度
                opacity: '0.5', // 透明度
                borderRadius: '8px'  ,  // 圆角效果
                fontSize: '20px',
              }}
          />
        </Form.Item>
        <Form.Item<FieldType>
            label={<span style={{ fontSize: '20px', fontFamily: 'Arial, sans-serif' }}>Email</span>}
          name="email"
          rules={[{ required: true, message: 'Please input your email address!' }]}
        >
          <Input
              style={{
                //backgroundColor: 'yellow',
                borderColor: '#7241FF', // 边框颜色
                borderWidth: '2px', // 边框宽度
                opacity: '0.5', // 透明度
                borderRadius: '8px'  ,  // 圆角效果
                fontSize: '20px',       // 输入文字的字体大小
              }}
          />
        </Form.Item>
        <Form.Item<FieldType>
            label={<span style={{ fontSize: '20px', fontFamily: 'Arial, sans-serif' }}>Message</span>}
          name="message"
          rules={[{ required: true, message: 'Please input your message!' }]}
        >
          <Input.TextArea
              style={{
                //backgroundColor: 'yellow',
                borderColor: '#7241FF', // 边框颜色
                borderWidth: '2px', // 边框宽度
                opacity: '0.5', // 透明度
                borderRadius: '8px' ,   // 圆角效果
                fontSize: '20px',
              }}
          />

        </Form.Item>
        <Form.Item<FieldType>
            style={{ display: 'flex', paddingLeft:'1000vpx',justifyContent: 'center', alignItems: 'center'  }}
        >
          <Turnstile onVerify={onTurnstileVerify}/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
          <Button className={submitBtn} type="primary" htmlType="submit">
            Schedule Demo
          </Button>
        </Form.Item>

      </Form>
    </div>
  </div>
};

export default DemoForm;