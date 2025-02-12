'use client'

import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import { Form, GetProp, Input, Select, Space, Upload, UploadProps, message } from 'antd';
import { countryOptions } from '@/constant/phone';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgWrapper from '@/component/ImgWrapper';
import { getUserInfo, updateUser, uploadAvatar } from '@/server/user';
import { SUCCESS_CODE } from '@/constant/common';
import { setLocalUser } from '@/util/storage';
import ChangePwModal from '@/component/ChangePwModal';
import {countryOptionss} from "@/constant/country";
import PrefixSelector from "@/component/PrefixSelector";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const CountryOptions = countryOptionss;
const {
  accountContainer,
  main,
  title,
  content,
  avatarUploader,
  avatarImg,
  accountForm,
  changeBtn,
  operateBox,
  cancel,
  save
} = styles;



const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const Account = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string>('');
  const [avatarStr, setAvatarStr] = useState<string>('');
  const [userId, setUserId] = useState(-1);
  const [showChangePw, setShowChangePw] = useState<boolean>(false);
  const [originUser, setOriginUser] = useState<User.UserShown | null>(null)

  useEffect(() => {
    initUserInfo()
  }, [])

  const initUserInfo = async () => {
    message.loading({ content: 'loading', duration: 10, key: 'loading' })
    const res = await getUserInfo()
    message.destroy('loading')
    if (res.code === SUCCESS_CODE) {
      const { 
        firstName,
        lastName,
        email,
        phone,
        country,
        company,
        id,
        avatar,
      } = res.data || {}

      setUserId(id);
      setAvatarStr(avatar);
      setLocalUser({ avatar })
      setOriginUser(res.data)
      
      form.setFieldsValue({
        firstName,
        lastName,
        password: '*******',
        email,
        phone: phone.split('-').length > 1 ? phone.split('-')[1] : '',
        prefix: phone.split('-').length > 1 ? '+' + phone.split('-')[0] : 'US +1',
        country,
        company,
      })
    }
  }

  const onChangePwOk = () => {
    setShowChangePw(false)
  }

  const onChangePwCancel = () => {
    setShowChangePw(false)
  }

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = async (info) => {
    console.log('handleChange')
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // frontend preview
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setPreviewAvatar(url);
      });

      const formData = new FormData();
      formData.append('file', info.file.originFileObj as Blob)
      const res = await uploadAvatar(formData)
      if (res.code === SUCCESS_CODE) {
        fetchUpdateUser(res.data)
      }
    }
  };

  const fetchUpdateUser = async (avatar?: string) => {
    const values = form.getFieldsValue();
    const {
      company = '',
      country = '',
      email = '',
      firstName = '',
      lastName = '',
      phone = '',
      prefix = 'US +1'
    } = values

    const data = {
      avatar: avatar || avatarStr,
      company,
      country,
      email,
      firstName,
      lastName,
      id: userId,
      phone: phone==='' ? '' : prefix.substring(prefix.indexOf("+") + 1) + '-' + phone
    }
    console.log(data.phone)
    const updateRes = await updateUser(data)
    if (updateRes.code === SUCCESS_CODE) {
      setLocalUser({ avatar: avatar || avatarStr })
      message.success({ content: 'upload successfully' })
    }
  };

  const onSave = async () => {
    await fetchUpdateUser()
    initUserInfo()
  };

  const onCancel = () => {
    if (originUser) {
      const { 
        firstName,
        lastName,
        email,
        phone,
        country,
        company,
      } = originUser;
      
      form.setFieldsValue({
        firstName,
        lastName,
        password: '*******',
        email,
        phone: phone===undefined ? '' : phone.split('-').length > 1 ? phone.split('-')[1] : '',
        prefix: phone===undefined ? '':phone.split('-').length > 1 ? '+' + phone.split('-')[0] : 'US +1',
        country,
        company,
      })
    }
  }

  const countrySelector = (
      <Form.Item  name="country" noStyle>
        <Select
            style={{width: 400}}
            dropdownStyle={{ minWidth: 250,minHeight: 250 }}
            placeholder="Country"
            showSearch
            options={CountryOptions}
        >
        </Select>
      </Form.Item>
  );
  const handlePointerEnter = () => {};
  const handlePointerLeave = () => {};
  const uploadButton = (

      <button style={{border: 0, background: 'none'}} type="button">
        {loading ? (
            // @ts-ignore
            <LoadingOutlined onPointerOverCapture={undefined} onPointerOutCapture={undefined}/>
        ) : (
            // @ts-ignore
            <PlusOutlined onPointerOverCapture={undefined} onPointerOutCapture={undefined}/>
        )}
        <div style={{marginTop: 8}}>Upload</div>
      </button>
  );

  return <div className={accountContainer}>
    <EnteredHeader avatar={avatarStr}/>
    <SideBar/>
    <div className={main}>
      <div className={title}>Account</div>
      <div className={content}>
        <Upload
            name="avatar"
            listType="picture-card"
            className={avatarUploader}
            showUploadList={false}
            action=""
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {
            avatarStr || previewAvatar
              ? <ImgWrapper className={avatarImg} src={avatarStr || previewAvatar} alt="avatar" />
              : uploadButton
          }
        </Upload>
        <Form
          form={form}
          name="account"
          className={accountForm}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          labelAlign='right'
          initialValues={{ prefix: 'US +1', password: '*******' }}
          colon={false}
        >
          <Form.Item
            name='firstName'
          >
            <Input placeholder="First name" />
          </Form.Item>
          <Form.Item
            name='lastName'
          >
            <Input placeholder="Lastname" />
          </Form.Item>
          <Form.Item
          >
            <Space.Compact block size='large'>
              <Form.Item name='password' style={{ width: '100%' }}>
                <Input type='password' disabled />
              </Form.Item>
              <div className={changeBtn} onClick={() => setShowChangePw(true)}>Change Password</div>
            </Space.Compact>
          </Form.Item>
          <Form.Item
            name='email'
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item

            name='phone'
          >
            <Input
              addonBefore={<PrefixSelector/>}
            />
          </Form.Item>
          <Form.Item

            name='country'
          >
            {countrySelector}
          </Form.Item>
          <Form.Item
            name='company'
          >
            <Input placeholder="Company"/>
          </Form.Item>
        </Form>
        <div className={operateBox}>
          <div className={cancel} onClick={onCancel}>Cancel</div>
          <div className={save} onClick={onSave}>Save</div>
        </div>
      </div>
    </div>
    <ChangePwModal
      visible={showChangePw}
      onOk={onChangePwOk}
      onCancel={onChangePwCancel}
    />
  </div>
};

export default Account;
