"use client"

import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import {
  DatePicker,
  Form,
  GetProp,
  Input,
  Select,
  Upload,
  UploadProps,
  message,
  Space,
  Checkbox,
  Modal,
  Tag
} from 'antd';
import { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { countryOptions } from '@/constant/phone';
import { getContact, updateContact, uploadAvatar } from '@/server/contact';
import { SUCCESS_CODE } from '@/constant/common';
import { addContact } from '@/server/contact';
import { useRouter, useSearchParams } from 'next/navigation';
import {addGroup, getGroupList, getGroupsAndContactCount, getSubscriptionCount} from '@/server/group';
import dayjs from 'dayjs'
import PrefixSelector from "@/component/PrefixSelector";
import Link from "next/link";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import {ReloadIcon} from "@radix-ui/react-icons";
import {AppleIcon} from "lucide-react";


const selectOptions = countryOptions;
const { Option } = Select;
const {
  userListContainer,
  main,
  title,
  titleLeft,
  operateBox,
  saveBtn,
  content,
  contactForm,
  groupModal,
  value,
groupContent,
  inputItem,
    label,
} = styles;
{groupModal}
const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const ContactEditor = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string>('');
  const [submit, setSubmit] = useState<boolean>(false);
  const [avatarStr, setAvatarStr] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<number>(1);
  const [groupList, setGroupList] = useState<{ groupName: string, id: number }[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams()
  const contactId = Number(searchParams.get('id'))
  const [originContact, setOriginContact] = useState<Contact.NewContact | null>(null)
  const [showGroup, setShowGroup] = useState<boolean>(false);
  const [groupName, setGroupName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    initGroupList()
    initContact()
  }, [])

  const initGroupList = async () => {
    const res = await getGroupList()
    if (res.code === SUCCESS_CODE) {
      setGroupList(res.data)
    }
  }

  function CurrentDateComponent() {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
      const timer = setTimeout(() => {
        setCurrentDate(new Date());
      }, 60000); // 每秒更新日期

      return () => clearTimeout(timer); // 组件卸载时清除定时器
    }, []);

    return <label>{currentDate.toLocaleDateString()}</label>;
  }

  const initContact = async () => {
    if (typeof contactId === 'number' && !isNaN(contactId)) {
      message.loading({ content: 'loading', duration: 10, key: 'contactLoading' })
      const res = await getContact(contactId)
      message.destroy('contactLoading')
      if (res.code === SUCCESS_CODE) {
        const {
          avatar,
          isAvailable,
          birthDate,
          company,
          country,
          dept,
          email,
          firstName,
          lastName,
          groupName,
          phone,
          mobile,
          subscriptionType,
          note,
          title,
        } = res.data || {}
        console.log(isAvailable)
        setAvatarStr(avatar);
        setIsAvailable(1)
        setOriginContact(res.data)

        form.setFieldsValue({
          firstName,
          lastName,
          email,
          phone: phone===undefined ? '' : phone.split('-').length > 1 ? phone.split('-')[1] : '',
          prefix: phone===undefined ? 'US +1' : phone.split('-').length > 1 ? '+' + phone.split('-')[0] : 'US +1',
          country,
          company,
          dept,
          title,
          birthdate: dayjs(birthDate),
          groups: groupName,
          subscriptionType,
          note,
          mobile,
        })
      }
    }
  }

  const onGroupOk = async () => {
    if (groupName) {
      const res = await addGroup(groupName)
      if (res.code === SUCCESS_CODE) {
        initGroupList()
        initGroupNum()
        initSubNum()
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    }
    setShowGroup(false)
  }
  const [groupNumObj, setGroupNumObj] = useState<Record<string, number> | null>(null);
  const [subObj, setSubObj] = useState<Record<string, number> | null>(null);

  const initSubNum = async () => {
    const res = await getSubscriptionCount()
    console.log(res.data);
    if (res.code === SUCCESS_CODE) {
      setSubObj(res.data)

    }
  }
  const initGroupNum = async () => {
    //console.log("sadfhsadhfgsdjafgdsajhf");
    const res = await getGroupsAndContactCount()
    if (res.code === SUCCESS_CODE) {
      setGroupNumObj(res.data)
    }
  }
  const onGroupCancel = () => {
    setShowGroup(false)
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
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setPreviewAvatar(url);
      });

      const formData = new FormData();
      formData.append('file', info.file.originFileObj as Blob)
      const res = await uploadAvatar(formData)
      if (res.code === SUCCESS_CODE) {
        setAvatarStr(res.data)
      }
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ?
          // @ts-ignore
          <LoadingOutlined onPointerOverCapture={undefined} onPointerOutCapture={undefined} /> : <PlusOutlined onPointerOverCapture={undefined} onPointerOutCapture={undefined} />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );


  const onSave = async () => {

    if (isProcessing) return;
    setIsProcessing(true);
    if(!submit){
      setSubmit(true)
      const values = form.getFieldsValue()
      const {
        birthdate,
        company,
        dept,
        email,
        firstName,
        groups,
        lastName,
        note,
        phone = '',
        prefix = 'US +1',
        title,
        subscriptionType,
      } = values;
      if (!email) {
        message.error('Please fill in email!');
        setSubmit(false);
        setIsProcessing(false);
        return;
      }
      if (!groups) {
        message.error('Please fill in groups!');
        setSubmit(false);
        setIsProcessing(false);
        setShowGroup(true);
        return;
      }
      if (!subscriptionType) {
        message.error('Please fill in subscriptionType!');
        setSubmit(false);
        setIsProcessing(false);
        return;
      }
      const data = {
        avatar: avatarStr,
        isAvailable,
        birthDate: birthdate ? dayjs(birthdate).format('YYYY-MM-DD') : '',
        company,
        country: '',
        dept,
        email,
        firstName,
        lastName,
        groupName: groups,
        subscriptionType,
        mobile: prefix.substring(prefix.indexOf("+") + 1) + '-' + phone,
        note,
        phone: phone==='' ? '' : prefix.substring(prefix.indexOf("+") + 1) + '-' + phone,
        title,
        id: contactId,
      }
      if (contactId) {
        const res = await updateContact(data);
        if (res.code === SUCCESS_CODE) {
          message.success(res.message, () => {
            router.back()
          })
        } else {
          message.error(res.message)
          setIsProcessing(false)
          setSubmit(false);
        }
      } else {
        message.loading({ content: 'loading', duration: 10, key: 'Loading' })
        const res = await addContact(data);
        if (res.code === SUCCESS_CODE) {
          message.success(res.message, () => {
            router.back()
          })
        } else {
          message.error(res.message)
          setIsProcessing(false)
          setSubmit(false);
        }
      }
    }
    setIsProcessing(false);
  }

  const handleCheckboxChange = (e: { target: { checked: any; }; }) => {
    setIsAvailable(e.target.checked ? 1 : 0);
  };

  const handleSwitchChange = (checked:boolean) => {
    setIsAvailable(checked ? 1 : 0);
  };

  const onCancel = () => {
    if (contactId && originContact) {
      const {
        avatar,
        birthDate,
        company,
        country,
        dept,
        email,
        firstName,
        lastName,
        groupName,
        phone,
        mobile,
        note,
        title,

      } = originContact || {}

      setAvatarStr(avatar);

      form.setFieldsValue({
        firstName,
        lastName,
        email,
        phone: phone===undefined ? '' : phone.split('-').length > 1 ? phone.split('-')[1] : '',
        prefix: phone===undefined ? '':phone.split('-').length > 1 ? '+' + phone.split('-')[0] : 'US +1',
        country,
        company,
        dept,
        title,
        birthdate: dayjs(birthDate),
        groups: groupName,
        note,
        mobile,
      })
    } else {
      router.back()
    }
  }

  return <div className={userListContainer}>
    <EnteredHeader />
    <SideBar />
    <div className={main}>
      <div className={title}>
        <div className={titleLeft}>
          <Link href='/contactList'>Contacts</Link>
          <span style={{margin: '0 0.5em', color: '#666'}}>/</span>
          <span style={{color: '#999999'}}>{contactId ? 'Edit Contact' : 'Add New'}</span>
        </div>
      </div>
      <Card className="overflow-hidden w-3/5 mt-4 mx-auto">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              {contactId ? 'Edit Contact' : 'New Contact'}
            </CardTitle>
            <CardDescription>Date:{CurrentDateComponent()}</CardDescription>
          </div>
        </CardHeader>
      <CardContent >
      <div className={content}>
        {/*<Upload//上传头像*/}
        {/*  name="avatar"*/}
        {/*  listType="picture-card"*/}
        {/*  className={avatarUploader}*/}
        {/*  showUploadList={false}*/}
        {/*  action=""*/}
        {/*  beforeUpload={beforeUpload}*/}
        {/*  onChange={handleChange}*/}
        {/*>*/}
        {/*  {*/}
        {/*    avatarStr || previewAvatar*/}
        {/*      ? <ImgWrapper className={avatarImg} src={avatarStr || previewAvatar} alt="avatar" />*/}
        {/*      : uploadButton*/}
        {/*  }*/}
        {/*</Upload>*/}
        <Form
            form={form}
            name="addContact"
            className={contactForm}
            labelCol={{span: 5}}
            wrapperCol={{span: 19}}
            labelAlign='right'
            initialValues={{prefix: 'US +1'}}
            colon={false}
        >
          {/*修改输入框样式*/}
          {/*style={{paddingLeft:'15px',height:'50px',fontSize:'18px',borderColor:'#7241FF',borderRadius:'14px'}}*/}
          <Form.Item style={{marginBottom: 0, width: '100%'}}>
            <div
                className="mt-0.5 mb-0.5 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
              <div className="space-y-1">
                {/*<p className="text-sm font-medium leading-none">*/}
                {/*  /!*<Tag color="error">Required</Tag>*!/*/}
                {/*  firstname*/}
                {/*</p>*/}
                <p className="text-sm text-muted-foreground">
                </p>
                <Form.Item name='firstName'
                           style={{display: 'inline-block', marginRight: '16px', width: 'calc(50% - 8px)'}}>
                  <Input placeholder="First name"/>
                </Form.Item>

              </div>
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
              <div className="space-y-1">
                {/*<p className="text-sm font-medium leading-none">*/}
                {/*  /!*<Tag color="error">Required</Tag>*!/*/}
                {/*  lastname*/}
                {/*</p>*/}
                <p className="text-sm text-muted-foreground">
                </p>
                <Form.Item name='lastName'
                           style={{display: 'inline-block', width: 'calc(50% - 8px)'}}>
                  <Input placeholder="Last name"/>
                </Form.Item>

              </div>
            </div>
          </Form.Item>
          {/*<Form.Item name='firstName'*/}
          {/*           style={{display: 'inline-block', marginRight: '16px', width: 'calc(50% - 8px)'}}>*/}
          {/*  <Input placeholder="First name"/>*/}
          {/*</Form.Item>*/}
          {/*<Form.Item name='lastName'*/}
          {/*           style={{display: 'inline-block', width: 'calc(50% - 8px)'}}>*/}
          {/*  <Input placeholder="Last name"/>*/}
          {/*</Form.Item>*/}

          <div
              className="mt-0.5 mb-0.5 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
            <div className="space-y-1">
              {/*<p className="text-sm font-medium leading-none">*/}
              {/*  Email*/}
              {/*</p>*/}
              {/*<p className="text-sm text-muted-foreground">*/}
              {/*  <Tag color="error">Required</Tag>Enter Contact email*/}
              {/*</p>*/}

              <Form.Item
                  name='email'
                  rules={[{required: true, message: 'Please input your email!'}]}
              >
                <Input placeholder="* m@example.com"/>
              </Form.Item>

            </div>
          </div>
          {/*<Form.Item*/}

          {/*    name='email'*/}
          {/*    rules={[{required: true, message: 'Please input your email!'}]}*/}
          {/*>*/}
          {/*  <Input placeholder="* Email"/>*/}
          {/*</Form.Item>*/}
          <div
              className="mt-0.5 mb-0.5 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
            <div className="space-y-1">
              {/*<p className="text-sm font-medium leading-none">*/}
              {/*  Email2*/}
              {/*</p>*/}
              {/*<p className="text-sm text-muted-foreground">*/}
              {/*/!*<Tag color="error">Required</Tag>*!/<Tag color="warning">optional</Tag>*/}
              {/*  Enter Second email*/}
              {/*</p>*/}
              <Form.Item

                  name='email2'
              >
                <Input placeholder="Email2"/>
              </Form.Item>
            </div>
          </div>

          {/*    name='email2'*/}
          {/*>*/}
          {/*  <Input placeholder="Email2"/>*/}
          {/*</Form.Item>*/}

          <div
              className="mt-0.5 mb-0.5 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
            <div className="space-y-1">
              {/*<p className="text-sm font-medium leading-none">*/}
              {/*  Phone*/}
              {/*</p>*/}
              {/*<p className="text-sm text-muted-foreground">*/}
              {/*  /!*<Tag color="error">Required</Tag>*!/*/}
              {/*  Enter Contact Phone*/}
              {/*</p>*/}
              <Form.Item
                  name='phone'
              >
                <Input placeholder='Phone' addonBefore={<PrefixSelector/>}
                       style={{borderColor: '#7241FF', borderRadius: '14px'}}/>
              </Form.Item>
            </div>
          </div>
          <div
              className="mt-0.5 mb-0.5 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
            <div className="space-y-1">
              {/*<p className="text-sm font-medium leading-none">*/}
              {/*  Company*/}
              {/*</p>*/}
              {/*<p className="text-sm text-muted-foreground">*/}
              {/*  <Tag color="error">Required</Tag>Enter some musts*/}
              {/*</p>*/}
              <Form.Item style={{marginBottom: 0}}>
                <Form.Item name='company'
                           style={{display: 'inline-block', marginRight: '8px', width: 'calc(50% - 8px)'}}>
                  <Input placeholder="Company"/>
                </Form.Item>
                <Form.Item name='dept'
                           style={{display: 'inline-block', marginRight: '8px', width: 'calc(30% - 8px)'}}>
                  <Input placeholder="Dept"/>
                </Form.Item>
                <Form.Item name='title' className="w-1" style={{display: 'inline-block', width: 'calc(20%)'}}>
                  <Input placeholder="Title"/>
                </Form.Item>
              </Form.Item>
            </div>
          </div>
          <div
              className="mt-0.5 mb-0.5 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
            <div className="space-y-1">
              {/*<p className="text-sm font-medium leading-none">*/}
              {/*  BirthDay*/}
              {/*</p>*/}
              {/*<p className="text-sm text-muted-foreground">*/}
              {/*  <Tag color="warning">optional</Tag>*/}
              {/*  Contact BirthDay*/}
              {/*</p>*/}
              <Form.Item
                  name='birthdate'
              >
                <DatePicker style={{width: '100%'}}/>
              </Form.Item>
            </div>
          </div>
          <div
              className="mt-0.5 mb-0.5 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
            <div className="space-y-1">
              {/*<p className="text-sm font-medium leading-none">*/}
              {/*  Groups*/}
              {/*</p>*/}
              {/*<p className="text-sm text-muted-foreground">*/}
              {/*  <Tag color="error">Required</Tag>Select Contact Groups*/}
              {/*</p>*/}
              <Form.Item

                  name='groups'
                  rules={[{required: true, message: 'Please input your groupName!'}]}
              >

                {
                  groupList.length
                      ? <Select
                          placeholder="* Groups"
                          options={groupList.map((item, index) => ({
                            value: item.groupName,
                            label: item.groupName
                          }))}
                      />
                      : <Input placeholder="Use commas to separate multiple words or phrases"/>
                }
                {/*<div  onClick={() => setShowGroup(true)}>+</div>*/}
              </Form.Item>
            </div>
          </div>
          <div
              className="mt-0.5 mb-0.5 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
            <div className="space-y-1">
              {/*<p className="text-sm font-medium leading-none">*/}
              {/*  subscriptionType*/}
              {/*</p>*/}
              {/*<p className="text-sm text-muted-foreground">*/}
              {/*  <Tag color="error">Required</Tag>Contacts Subscription Type*/}

              {/*</p>*/}
              <Form.Item
                  name='subscriptionType'
                  rules={[{required: true, message: 'Please select a subscription type!'}]}
              >
                <Select placeholder="* Subscription type">
                  <Option value="Subscribed">Subscribed contact</Option>
                  <Option value="Unsubscribed">Unsubscribed contact</Option>
                  <Option value="Non-subscribed">Non-subscribed contact</Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div
              className="mt-0.5 mb-0.5 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
            <div className="space-y-1">
              {/*<p className="text-sm font-medium leading-none">*/}
              {/*  Note*/}
              {/*</p>*/}
              {/*<p className="text-sm text-muted-foreground">*/}
              {/*  /!*<Tag color="error">Required</Tag>*!/*/}
              {/*  /!*Enter Second email*!/*/}
              {/*</p>*/}
              <Form.Item
                  name='note'
              >
                <Input.TextArea placeholder="Memo"/>
              </Form.Item>
            </div>
          </div>
          <div
              className="mt-0.5 mb-0.5 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
          >
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
            <div className="space-y-1">
              <Form.Item name={"isAvailable"}>
                <div className=" flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Confirm Emails
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Switch to confirm that you have permission to send emails to this contact person
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The Cusob system will use AI to determine whether the email address can be contacted
                    </p>
                  </div>
                  <Switch checked={isAvailable === 1} onCheckedChange={(checked) => {
                    handleSwitchChange(checked)
                  }}/>
                </div>
              </Form.Item>
            </div>
          </div>

          {/*<Form.Item*/}
          {/*    name='phone'*/}
          {/*>*/}
          {/*  <Input placeholder='Phone' addonBefore={<PrefixSelector/>}*/}
          {/*         style={{borderColor: '#7241FF', borderRadius: '14px'}}/>*/}
          {/*</Form.Item>*/}
          {/*<Form.Item style={{marginBottom: 0}}>*/}
          {/*  <Form.Item name='company' style={{display: 'inline-block', marginRight: '8px', width: 'calc(50% - 8px)'}}>*/}
          {/*    <Input placeholder="Company"/>*/}
          {/*  </Form.Item>*/}
          {/*  <Form.Item name='dept' style={{display: 'inline-block', marginRight: '8px', width: 'calc(30% - 8px)'}}>*/}
          {/*    <Input placeholder="Dept"/>*/}
          {/*  </Form.Item>*/}
          {/*  <Form.Item name='title' className="w-1" style={{display: 'inline-block', width: 'calc(20%)'}}>*/}
          {/*    <Input placeholder="Title"/>*/}
          {/*  </Form.Item>*/}
          {/*</Form.Item>*/}
          {/*<Form.Item*/}

          {/*    name='birthdate'*/}
          {/*>*/}
          {/*  <DatePicker style={{width: '100%'}}/>*/}
          {/*</Form.Item>*/}

          {/*<Form.Item*/}

          {/*    name='groups'*/}
          {/*    rules={[{required: true, message: 'Please input your groupName!'}]}*/}
          {/*>*/}

          {/*  {*/}
          {/*    groupList.length*/}
          {/*        ? <Select*/}
          {/*            placeholder="* Groups"*/}
          {/*            options={groupList.map((item, index) => ({*/}
          {/*              value: item.groupName,*/}
          {/*              label: item.groupName*/}
          {/*            }))}*/}
          {/*        />*/}
          {/*        : <Input placeholder="Use commas to separate multiple words or phrases"/>*/}
          {/*  }*/}
          {/*  /!*<div  onClick={() => setShowGroup(true)}>+</div>*!/*/}
          {/*</Form.Item>*/}
          {/*<Form.Item*/}
          {/*    name='subscriptionType'*/}
          {/*>*/}
          {/*  <Input placeholder="Subscription type" />*/}
          {/*</Form.Item>*/}

          {/*<Form.Item*/}
          {/*    name='subscriptionType'*/}
          {/*    rules={[{required: true, message: 'Please select a subscription type!'}]}*/}
          {/*>*/}
          {/*  <Select placeholder="* Subscription type">*/}
          {/*    <Option value="Subscribed">Subscribed contact</Option>*/}
          {/*    <Option value="Unsubscribed">Unsubscribed contact</Option>*/}
          {/*    <Option value="Non-subscribed">Non-subscribed contact</Option>*/}
          {/*  </Select>*/}
          {/*</Form.Item>*/}

          {/*<Form.Item*/}
          {/*    name='note'*/}
          {/*>*/}
          {/*  <Input.TextArea placeholder="Memo"/>*/}
          {/*</Form.Item>*/}
          {/*<Form.Item name="isAvailable">*/}
          {/*  <Checkbox checked={isAvailable === 1} onChange={handleCheckboxChange}>*/}
          {/*    Check to confirm that you have permission to send emails to this contact person*/}
          {/*  </Checkbox>*/}
          {/*</Form.Item>*/}
          {/*<Form.Item name={"isAvailable"}>*/}
          {/*  <div className=" flex items-center space-x-4 rounded-md border p-4">*/}
          {/*    <div className="flex-1 space-y-1">*/}
          {/*      <p className="text-sm font-medium leading-none">*/}
          {/*        Confirm Emails*/}
          {/*      </p>*/}
          {/*      <p className="text-sm text-muted-foreground">*/}
          {/*        Switch to confirm that you have permission to send emails to this contact person*/}
          {/*      </p>*/}
          {/*    </div>*/}
          {/*    <Switch checked={isAvailable === 1} onCheckedChange={(checked) => {*/}
          {/*      handleSwitchChange(checked)*/}
          {/*    }}/>*/}
          {/*  </div>*/}
          {/*</Form.Item>*/}

        </Form>
        <div className={operateBox}>
          {/*<div onClick={onCancel}>Cancel</div>*/}
          {/*<div className={saveBtn} onClick={*/}
          {/*  !isProcessing ? onSave : undefined*/}
          {/*}>Add contact*/}
          {/*</div>*/}
          {!isProcessing ? (<Button onClick={onSave} >
            <AppleIcon className="mr-2 h-4 w-4 " />
            {contactId ? 'Edit Contact' : 'Add Contact'}
          </Button>) : (<Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>)}
          {/*<Button disabled>*/}
          {/*  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />*/}
          {/*  Please wait*/}
          {/*</Button>*/}
        </div>

      </div>
      </CardContent>
      </Card>
    </div>
    <Modal
        title="Add Group"
        open={showGroup}
        onOk={onGroupOk}
        onCancel={onGroupCancel}
        wrapClassName={groupModal}
    >
      <div className={groupContent}>
        <div className={inputItem}>
          <div className={label}>Group Name</div>
          <Input value={groupName} onChange={e => setGroupName(e.target.value)} className={value}/>
        </div>
      </div>
    </Modal>

  </div>
};

export default ContactEditor;
