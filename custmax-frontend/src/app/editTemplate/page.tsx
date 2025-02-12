'use client';
import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import { Form, Input, Radio, RadioChangeEvent, message } from 'antd';
import ImgWrapper from '@/component/ImgWrapper';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import { getTemplate, saveTemplate, updateTemplate } from '@/server/template';
import { useRouter, useSearchParams } from 'next/navigation';
import { SUCCESS_CODE } from '@/constant/common';
import Link from "next/link";

const RichEditor =  dynamic(() => import('@/component/RichEditor/index'), { ssr: false });

const {
  editTemplateContainer,
  main,
  title,
  titleLeft,
  operateBox,
  searchInputBox,
  searchInput,
  searchIconBox,
  searchIcon,
  content,
  basicFormWrapper,
  basicForm,
  radioWrapper,
  richTextTitle,
  richTextWrapper,
  operateWrapper,
  saveBtn,
  cancelBtn,
} = styles;

const EditTemplate = () => {
  const [form] = Form.useForm()
  const [raioValue, setRaioValue] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams()
  const templateId =  Number(searchParams.get('id'));
  const realTemplateId = Number(searchParams.get('templateId'));
  const [richContent, setRichContent] = useState('');
  const [originTemplate, setOriginTemplate] = useState<Template.TemplateNew | null>(null)

  useEffect(() => {
    initTemplate()
  }, [])

  const initTemplate = async () => {
    if (typeof templateId === 'number' && !(templateId==0)) {
      message.loading({ content: 'initilization loading', duration: 10, key: 'contactLoading' })
      const res = await getTemplate(templateId)
      message.destroy('contactLoading')
      if (res.code === SUCCESS_CODE && res.data) {
        const {
          content,
          folder,
          name,
          subject,
          type,
        } = res.data || {}
  
        setOriginTemplate(res.data)
        
        form.setFieldsValue({
          name,
          folder,
          subject,
        })
        setRichContent(content)
        setRaioValue(type)
      }else {
        message.error(res.message)
      }
    }
  }

  const onRadioChange = (e: RadioChangeEvent) => {
    setRaioValue(e.target.value);
  };

  const onCancel = () =>{
    router.push('/emailTemplates')
  }

  const onSave = async () => {
    const values = form.getFieldsValue()
    const {
      name,
      folder,
      subject,
    } = values;
    const data: Template.TemplateNew = {
      content: richContent,
      folder,
      name,
      subject,
      type: raioValue,
    }
    if (templateId) {
      data.id = templateId
      const res = await updateTemplate(data)
      if (res.code === SUCCESS_CODE) {
        message.success(res.message, () => {
          router.back()
        })
      } else {
        message.error(res.message)
      }
    } else {
      const res = await saveTemplate(data)
      if (res.code === SUCCESS_CODE) {
        message.success(res.message, () => {
          router.back()
        })
      } else {
        message.error(res.message)
      }
    }
  }


  return <div className={editTemplateContainer}>
    <EnteredHeader />
    <SideBar />
    <div className={main}>
      <div className={title}>
        <div className={titleLeft}>
          <Link href='/emailTemplates'>Email template</Link>
        <span style={{ margin: '0 0.5em', color: '#666' }}>/</span>
        <span style={{ color: '#999999' }}>{templateId ? 'Edit Template' : 'Add Template'}</span>
        </div>
        <div className={operateBox}>
          <div className={searchInputBox}>
            <Input className={searchInput} placeholder='Search' />
            <div className={searchIconBox}>
              <ImgWrapper className={searchIcon} src='/img/search_icon.png' alt='search icon'  />
            </div>
          </div>
        </div>
      </div>
      <div className={content}>
        <div className={basicFormWrapper}>
          <Form
            form={form}
            name="binder"
            className={basicForm}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            labelAlign='left'
            colon={false}
          >
            <Form.Item
              label="Name"
              name='name'
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Subject"
              name='subject'
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Folder"
              name='folder'
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
        <div className={radioWrapper}>
          <Radio.Group onChange={onRadioChange} value={raioValue}>
            <Radio value={0}>Basic Templates</Radio>
            <Radio value={1}>Pre-designed Templates</Radio>
          </Radio.Group>
        </div>
        <div className={richTextTitle}>Content</div>
        <div className={richTextWrapper}>
          <RichEditor value={richContent} onChange={(val: string) => { setRichContent(val) }} />
        </div>
        <div className={operateWrapper}>
          <div className={saveBtn} onClick={onSave}>Save</div>
          <div className={cancelBtn} onClick={onCancel}>Cancel</div>
        </div>
      </div>
    </div>
  </div>
};



export default EditTemplate;
