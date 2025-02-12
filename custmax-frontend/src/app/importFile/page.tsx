'use client';
import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import ImgWrapper from '@/component/ImgWrapper';
import { GetProp, Input, Upload, UploadFile, UploadProps, message } from 'antd';
import { useRef, useState } from 'react';
import { batchImport } from '@/server/contact';
import { SUCCESS_CODE } from '@/constant/common';
import { useRouter } from 'next/navigation';
import {CONTACT_TEMPLATE} from '@/constant/cusob'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const {
  importFileContainer,
  main,
  title,
  arrowWrapper,
  arrowLeft,
  content,
  uploadWrapper,
  label,
  selectWrapper,
  selectBtn,
  sample,
  groupInput,
  operateBox,
  importBtn,
  cancelBtn,
} = styles;

const ImportFile = () => {
  const router = useRouter()
  const [groupName, setGroupName] = useState('')
  const fileRef = useRef<Blob>()

  const beforeUpload = (file: Blob) => {
    fileRef.current = file
    return false;
  };

  const handleChange: UploadProps['onChange'] = async (info) => {
    // if (info.file.status === 'uploading') {
    //   return;
    // }
    // if (info.file.status === 'done') {
    //   fileRef.current = info.file
    // }
  };

  const onImport = async () => {
    const formData = new FormData();
    if (fileRef.current) formData.append('file', fileRef.current as Blob)
    formData.append('groupName', groupName)
    const res = await batchImport(formData)
    if (res.code === SUCCESS_CODE) {
      message.success(res.message, () => {
        router.push('/contactList')
      })
    } else {
      message.error(res.message)
    }
  }

  const onSampleClick = () => {
    const a = document.createElement('a');
    a.download = 'Sample File';
    a.href = CONTACT_TEMPLATE;
    a.click();
  }

  return <div className={importFileContainer}>
    <EnteredHeader />
    <SideBar />
    <div className={main}>
      <div className={title}>
        <div onClick={() => router.back()} className={arrowWrapper}>
          <ImgWrapper className={arrowLeft} src='/img/arrow_left.png' alt='arrow left' />
          <span>Import</span>
        </div>
      </div>
      <div className={content}>
        <div className={uploadWrapper}>
          <div className={label}>FILE</div>
          <Upload
              name="select"
              className={selectWrapper}
              maxCount={1}
              action=""
              beforeUpload={beforeUpload}
              onChange={handleChange}
          >
            <div className={selectBtn}>Select</div>
          </Upload>
          <div className={sample} onClick={onSampleClick}>Sample file</div>
        </div>
        <div className={uploadWrapper}>
          <div className={label}>GROUP</div>
          <Input value={groupName} onChange={e => setGroupName(e.target.value)} className={groupInput} />
        </div>
        <div className={operateBox}>
          <div className={importBtn} onClick={onImport}>Import</div>
          <div className={cancelBtn} onClick={() => router.back()}>Cancel</div>
        </div>
      </div>
    </div>
  </div>
};

export default ImportFile;