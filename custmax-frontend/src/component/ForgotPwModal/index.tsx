import React, { ChangeEvent, FC, useState} from 'react';
import styles from './index.module.scss';
import {Input, Modal, message} from 'antd';
import {forgetPassword, sendEmailForResetPassword} from '@/server/user';
import {SUCCESS_CODE} from '@/constant/common';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { CloseOutlined } from '@ant-design/icons';

type Props = {
  visible: boolean,
  onOk: () => void,
  onCancel: () => void,
}

const {
  forgotPwModal,
  forgotPwContent,
  inputItem,
  cancelBtn,
  addressBox,
  addressValue,
  addressBtn,
  addressBt,
  value,
} = styles;

const ForgotPwModal: FC<Props> = (props) => {
  const {visible, onOk, onCancel} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reTypePassword, setReTypePassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [available, setAvailable] = useState(false);
  const router = useRouter();

  function validateEmail(email:string) {
    // 正则表达式用于验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const onSend = async () => {
    if (!email) {
      message.error('please input the email!');
    } else {
      message.success('send successfully!');
      const res = await sendEmailForResetPassword({email})
      if (res.code !== SUCCESS_CODE) {
        message.error(res.message);
      }

    }

  };

  const emailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setAvailable(validateEmail(newEmail));
  };


  const _onOk = async () => {
    if (password !== reTypePassword) {
      return message.error({ content: 'Make sure the two passwords are the same' })
    }
    const data = {
      email,
      password,
      verifyCode,
    }
    const res = await forgetPassword(data);
    if (res.code === SUCCESS_CODE) {
      message.success(res.message)
    } else {
      message.error(res.message)
    }
    onOk()
  }

  return <Modal
      title="Enter email to reset your password"
      open={visible}
      onCancel={onCancel}
      wrapClassName={forgotPwModal}
      footer={null}
      closable={false}
  >
    <div className={forgotPwContent}>
      <div className={inputItem}>
        <div className={addressBox}>
          <Input
              value={email}
              placeholder="Email"
              onChange={e => emailChange(e)}
              className={addressValue}/>
        </div>
      </div>
      {
        available ?
            <div className={addressBtn} onClick={onSend}>Reset Password</div>
            :
            <div className={addressBt}>Reset Password</div>
      }
      <div className={cancelBtn} onClick={onCancel}>Cancel</div>
    </div>
  </Modal>;
};

export default ForgotPwModal;
