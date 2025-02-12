'use client';
import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import classNames from 'classnames';
import {Checkbox, Form, Input, Modal, Radio, message, Button, Select} from 'antd';
import ImgWrapper from '@/component/ImgWrapper';
import React, { useState} from 'react';
import {checkEmail, saveSender, sendCodeForSender} from '@/server/sender';
import {FAILUE_CODE, SUCCESS_CODE} from '@/constant/common';
import { useRouter } from 'next/navigation';
import {emailsettings} from "@/constant/email";


const {
  addSenderContainer,
  vertifyModal,
  addressTitle,
  emailWrapper,
  emailInput,
  codeInput,
  sendBtn,
  binderModal,
  formWrapper,
  binderForm,
  checkboxWrapper,
  checkBox,
  main,
  title,
  titleLeft,
  exitBtn,
  content,
  card,
  active,
  radio,
    err,
  formControls
} = styles;



const AddSender = () => {
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()
  const [form3] = Form.useForm()
  const [showVertify, setShowVertify] = useState<boolean>(false);
  const [showBinder, setShowBinder] = useState<boolean>(false);
  const [showdomainBinder, setDomainshowBinder] = useState<boolean>(false);
  const [showManual, setShowManual] = useState<boolean>(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [sslsmtpchecked, setSslsmtpChecked] = useState(true)
  const [sslimapchecked, setSslimapChecked] = useState(true)
  const [sslpopchecked, setSslpopChecked] = useState(true)

  const [error, setError] = useState('');
  const [select, setSelect] = useState('IMAP');
  const [isProcessing, setIsProcessing] = useState(false);

  const onVertifyOk = () => {
    setShowVertify(false);
    router.push('/campaign?form=true');
  };
  let isSubmitting = false;

  function validateEmail(email:string) {
    // 正则表达式用于验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const onVertifyCancel = () => {

    setShowVertify(false);
  };

  async function onDomainBinderOk() {
    if (isProcessing) return;
    setIsProcessing(true);
    const {
      email
    } = form3.getFieldsValue();
    if(validateEmail(email)){
      message.loading({ content: 'loading', duration: 10, key: 'loading' })
      const res = await checkEmail(email)
      message.destroy('loading')
      if(res.code===SUCCESS_CODE){
        if(res.data !== undefined && res.data !== null){//已经存在
          router.push('/domainCertify?uuid=',res.data)
        }else {//不存在，发送邮件
          message.success('Email has been sent,Please check your email')
        }
      }
      else {
        message.error(res.data);
      }
    }else {
      message.error('This is not an email!')
    }
    setIsProcessing(false);
  };

  const onManualOk = async () => {
    if(isSubmitting){
      return;
    }
    isSubmitting = true
    const {
      email,
      password,
      imapPort,
      smtpServer,
      imapServer,
      popServer,
      popPort,
      smtpPort ,
    } = form2.getFieldsValue();

    const smtpEncryption = checked ? "STARTTLS" : sslsmtpchecked ? "SSL" : "NO" ;
    const imapEncryption = select==="POP3" ? undefined : sslimapchecked ? "SSL" : "NO";
    const popEncryption = select==="IMAP" ? undefined : sslpopchecked ? "SSL" : "NO";

    const data = {
      serverType: select,
      email,
      password,
      imapPort,
      popPort,
      smtpPort ,
      smtpServer,
      imapServer,
      popServer,
      smtpEncryption,
      imapEncryption,
      popEncryption
    }

    if(validateEmail(email)){
      message.loading({ content: 'loading', duration: 10, key: 'loading' })

      const res = await saveSender(data)
      message.destroy('loading')
      if (res.code === SUCCESS_CODE) {
        message.success(res.message)
        router.push('/emailList')
      } else {
        message.error(res.message)
      }
    }else {
      setError('Please input valid mail address');
      return;
    }
    isSubmitting = false;
    setShowBinder(false);
    setShowManual(false);
    form1.resetFields;
    form2.resetFields;
  }

  const onBinderOk = async () => {
    if(isSubmitting){
      return
    }
    isSubmitting = true
    const smtpEncryption = checked ? "STARTTLS" : sslsmtpchecked ? "SSL" : "NO" ;
    const imapEncryption = select==="POP3" ? undefined : sslimapchecked ? "SSL" : "NO";
    const popEncryption = select==="IMAP" ? undefined : sslpopchecked ? "SSL" : "NO";
    const {
      email,
      password,

    } = form1.getFieldsValue();
    const data = {
      email,
      password,
      serverType: "IMAP",
      smtpEncryption,
      imapEncryption,
      popEncryption
    }

    if(validateEmail(email)){
      message.loading({ content: 'loading', duration: 10, key: 'loading' })
      console.log(data)

      const res = await saveSender(data)

      message.destroy('loading')
      if (res.code === SUCCESS_CODE) {
        message.success(res.message)
        router.push('/emailList')
      } else {
        message.error(res.message)
      }
    }else {
      setError('Please input valid mail address');
      return;
    }
    isSubmitting = false;
    setShowBinder(false);
    form1.resetFields;
  };

  const onBinderCancel = () => {
    form1.resetFields(); // 重置表单数据
    form2.resetFields(); // 重置表单数据
    setError('')
    setShowBinder(false);
  };

  const onDomainBinderCancel = () => {
    setDomainshowBinder(false);
  };

  const onManualCancel=()=>{
    setShowManual(false);
  }

  const onUseChange = () => {
    setChecked(prev => !prev)
  };


  const onSSLsmtpUseChange = () => {
    if(!sslsmtpchecked){
      form2.setFieldValue("smtpPort",emailsettings.SMTP_PORT_SSL)
    }else {
      form2.setFieldValue("smtpPort",emailsettings.SMTP_PORT)
    }
    setSslsmtpChecked(prev => !prev)

  };

  const onSSLimapUseChange = () => {
    if(!sslimapchecked){
      form2.setFieldValue("imapPort",emailsettings.IMAP_PORT_SSL)
    }else {
      form2.setFieldValue("imapPort",emailsettings.IMAP_PORT)
    }
    console.log(form2.getFieldValue("imapServer"))
    setSslimapChecked(prev => !prev)
  };

    const onSSLpopUseChange = () => {
    if(!sslpopchecked){
      form2.setFieldValue("popPort",emailsettings.POP_PORT_SSL)
    }else {
      form2.setFieldValue("popPort",emailsettings.POP_PORT)
    }
    setSslpopChecked(prev => !prev)
  };
  const handleClick = () =>{
    setShowManual(true)
  }

  const onSendCode = async () => {
    if (verifyEmail) {
      const res = await sendCodeForSender(verifyEmail)
      if (res.code === SUCCESS_CODE) {
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    }
  };

  const jumpToDomainCertify = () => {
    router.push("/domainCertify");
  }
  const handleSubmit = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    form1
        .validateFields()
        .then(values => {
          // 在这里处理表单验证成功后的逻辑，例如提交表单数据等操作
          onBinderOk()
        })
        .catch(errorInfo => {
          // 在这里处理表单验证失败后的逻辑，例如提示用户错误信息等操作
          console.error('Validation failed:', errorInfo);
        });
    setIsProcessing(false);
  };

  const handleSubmitManual = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    form2
        .validateFields()
        .then(values => {
          // 在这里处理表单验证成功后的逻辑，例如提交表单数据等操作
          onManualOk()
        })
        .catch(errorInfo => {
          // 在这里处理表单验证失败后的逻辑，例如提示用户错误信息等操作
          console.error('Validation failed:', errorInfo);
        });
    setIsProcessing(false);
  };

  const selectOptions = [{"type":"POP3"},{"type":"IMAP"}].map(item => ({
    value: item.type,
    label: item.type,
  }))

  const handleSelectChange = (selectedValue: string) => {

    setSelect(selectedValue)
  };


  return <div className={addSenderContainer}>
    <EnteredHeader />
    <SideBar />
    <div className={main}>
      <div className={title}>
        <div className={titleLeft}>
          <span>Senders</span>
          <span style={{ margin: '0 0.5em', color: '#666' }}>/</span>
          <span style={{ color: '#999999' }}>Add a sender</span>
        </div>
        <div className={exitBtn} onClick={() => {router.back() }}>Exit</div>
      </div>
      <div className={content}>
        {/*<div className={classNames(card, { [active]: showVertify })} onClick={() => setShowVertify(true)}>*/}
        {/*  <ImgWrapper src='/img/vertification_icon.png' alt='vertification icon' className={vertifyIcon} />*/}
        {/*  <Radio checked={showVertify} className={radio} />*/}
        {/*  <span>Verification code</span>*/}
        {/*</div>*/}
        <div className={classNames(card, { [active]: showBinder })} onClick={() => setShowBinder(true)}>
          <Radio checked={showBinder} className={radio} />
          <span>Bind your Email Account</span>
        </div>
        <div className={classNames(card, { [active]: showdomainBinder })} onClick={() => setDomainshowBinder(true)}>
          <Radio checked={showdomainBinder} className={radio} />
          <span>Domain Authentication</span>
        </div>
        {/*<div className={card} onClick={jumpToDomainCertify}>*/}
        {/*  <Radio className={radio} />*/}
        {/*  <span>Domain Authentication</span>*/}
        {/*</div>*/}
      </div>
    </div>
    <Modal
      title="Verification code"
      open={showVertify}
      onOk={onVertifyOk}
      onCancel={onVertifyCancel}
      okText='Done'
      wrapClassName={vertifyModal}
    >
      <div className={addressTitle}>Add Sender Address</div>
      <div className={emailWrapper}>
        <Input value={verifyEmail} onChange={e => setVerifyEmail(e.target.value)} className={emailInput} />
        <div onClick={onSendCode} className={sendBtn}>Send Verifcation Email</div>
      </div>
      <div className={addressTitle}>Enter verification code</div>
        <Input className={codeInput} />
    </Modal>
    <Modal
      title="Bind your Email Account"
      open={showBinder}
      onOk={!isProcessing ?handleSubmit:undefined}
      onCancel={onBinderCancel}
      okText='Done'
      wrapClassName={binderModal}
    >
      <div className={formWrapper}>
        <Form
            form={form1}
            name="binder"
            className={binderForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign='right'
            colon={false}
            onFinish={onBinderOk}
        >

          {error && <div className={err}>{error}</div>}
          <Form.Item
              label="E-mail"
              name='email'
              rules={[{required:true,message: "Please input your email!"}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
              label="Password"
              name='password'
              rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input type='password' />
          </Form.Item>
        </Form>

          <Button className={formControls} type="primary" onClick={handleClick}>MANUAL</Button>


      </div>

    </Modal>
    <Modal
        title="Domain Authentication"
        open={showdomainBinder}
        // onOk={!isProcessing?onDomainBinderOk:undefined}
        onOk={onDomainBinderOk}
        onCancel={onDomainBinderCancel}
        okText='Done'
        wrapClassName={binderModal}
    >
      <div className={formWrapper}>
        <Form
            form={form3}
            className={binderForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign='right'
            colon={false}
        >
          {error && <div className={err}>{error}</div>}
          <Form.Item
              label="E-mail"
              name='email'
              rules={[{required:true,message: "Please input your email!"}]}
          >
            <Input />
          </Form.Item>

        </Form>

      </div>
    </Modal>
    <Modal
        title="Manual Settings"
        open={showManual}
        onOk={!isProcessing ?handleSubmitManual:undefined}
        onCancel={onManualCancel}
        okText='Done'
        wrapClassName={binderModal}
    >
      <div className={formWrapper}>
        <Form
            form={form2}
            name="manual"
            className={binderForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign='right'
            colon={false}
            initialValues={{
              smtpPort: emailsettings.SMTP_PORT_SSL,
              imapPort: emailsettings.IMAP_PORT_SSL,
              popPort: emailsettings.POP_PORT_SSL
            }}

        >
          <Form.Item name="serverType"
                     label="Server Type"
          >
            <Select
                options={selectOptions}
                defaultValue="IMAP"
                onChange={handleSelectChange}
            />
          </Form.Item>
          {error && <div className={err}>{error}</div>}
          <Form.Item
              label="E-mail account"
              name='email'
              rules={[{required:true,message: "Please input your email!"}]}
          >

            <Input />
          </Form.Item>

          <Form.Item
              label="Password"
              name='password'
              rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input type='password' />
          </Form.Item>
          {select!=='POP3' ? <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Form.Item label="IMAP Server"
                       name='imapServer'
                       style={{  marginBottom: 0,marginLeft:'20px' }}
                       labelCol={{ span: 8 }}
                       rules={[{ required: true, message: 'Please input your imapServer!' }]}
            >
              <Input style={{marginLeft:'3px' ,width:'170px' ,marginRight:'23px'}}/>
            </Form.Item>
            <Checkbox
                checked={sslimapchecked}
                onChange={onSSLimapUseChange}
            >
              SSL
            </Checkbox>
            <Form.Item label="Port"
                       name='imapPort'
                       style={{ marginBottom: 0 ,width: '85px'}}
                       labelCol={{ span: 7 }}

            >
              <Input style={{marginLeft:'10px'}} />
            </Form.Item>
          </div> : <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Form.Item label="POP Server"
                       name='popServer'
                       style={{  marginBottom: 0,marginLeft:'20px' }}
                       labelCol={{ span: 8 }}
                       rules={[{ required: true, message: 'Please input your popServer!' }]}
            >
              <Input style={{marginLeft:'3px' ,width:'170px' ,marginRight:'23px'}} />
            </Form.Item>
            <Checkbox
                checked={sslpopchecked}
                onChange={onSSLpopUseChange}
            >
              SSL
            </Checkbox>
            <Form.Item label="Port"
                       name='popPort'
                       style={{ marginBottom: 0 ,width: '85px'}}
                       labelCol={{ span: 7 }}

            >
              <Input style={{marginLeft:'10px'}} />
            </Form.Item>
          </div>
          }

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Form.Item label="SMTP Server"
                       name='smtpServer'
                       style={{  marginBottom: 0,marginLeft:'20px' }}
                       labelCol={{ span: 8 }}
                       rules={[{ required: true, message: 'Please input your smtpServer!' }]}
            >
              <Input style={{marginLeft:'3px' ,width:'170px' ,marginRight:'15px'}} />
            </Form.Item>
            <Checkbox
                checked={sslsmtpchecked}
                onChange={onSSLsmtpUseChange}
            >
              SSL
            </Checkbox>
            <Form.Item label="Port" name='smtpPort' style={{ marginBottom: 0 ,width: '85px'}} labelCol={{ span: 7 }}>
              <Input style={{marginLeft:'10px'}} />
            </Form.Item>
          </div>
        </Form>
      </div>

      <div className={checkboxWrapper}>
        <Checkbox
            checked={checked}
            className={checkBox}
            onChange={onUseChange}
        >
          Use STARTTLS if server supports
        </Checkbox>
      </div>
    </Modal>
  </div>
};

export default AddSender;
