import React, {ChangeEvent, FC, useEffect, useRef, useState} from 'react';
import styles from './index.module.scss';
import {Input, Modal, message, UploadProps, Upload, Select, Form} from 'antd';
import {SUCCESS_CODE} from '@/constant/common';
import { useRouter } from 'next/navigation';
import {batchImport, parseFields} from "@/server/contact";
import {CONTACT_TEMPLATE} from "@/constant/cusob";
import {getGroupList} from "@/server/group";


type Props = {
  visible: boolean,
  onOk: () => void,
  onCancel: () => void,
}
const { Option } = Select;
const {
  forgotPwModal,
  forgotPwContent,
  cancelBtn,
  addressValue,
  addressBtn,
  addressBt,
  uploadWrapper,
  label,
  selectWrapper,
  selectBtn,
  sample,
} = styles;

const UploadModal: FC<Props> = (props) => {

  const {visible, onOk, onCancel} = props;
  const [available, setAvailable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [groupList, setGroupList] = useState<{ groupName: string, id: number }[]>([]);
  //const router = useRouter();
  useEffect(() => {
    initGroupList()
  }, [])
  const initGroupList = async () => {
    const res = await getGroupList()
    if (res.code === SUCCESS_CODE) {
      setGroupList(res.data)
    }
  }
  const router = useRouter()
  const [subscriptionType, setSubscriptionType] = useState('')
  const [groupName, setGroupName] = useState('')
  const fileRef = useRef<Blob>()
  const beforeUpload = (file: Blob) => {
    fileRef.current = file
    return false;
  };
  const handleChange = async (info: any) => {
    if (info.file.status === 'removed') {
      setAvailable(false); // 文件被移除，设置 available 为 false
    } else {
      setAvailable(true);  // 文件上传成功，设置 available 为 true
      const formData = new FormData();
      if (fileRef.current) formData.append('file', fileRef.current as Blob)
      const res = await parseFields(formData)
      if (res.code === SUCCESS_CODE) {
        message.success("Success upload")
      } else {
        message.error("Reload Again")
      }
    }
  };

  const onImport = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const formData = new FormData();
    if (fileRef.current) formData.append('file', fileRef.current as Blob)//将文件添加到formData中
    formData.append('groupName', groupName)
    formData.append('subscriptionType', subscriptionType);
    const res = await batchImport(formData)
    console.log(res)
    if (res.code === SUCCESS_CODE) {
      message.success("Success")
      router.push('/importResult')
      setIsProcessing(false);
    } else {
      message.error(res.message)
      setIsProcessing(false);
    }
  }

  const onSampleClick = () => {
    const a = document.createElement('a');
    a.download = 'Sample File';
    a.href = CONTACT_TEMPLATE;
    a.click();
  }

  return <Modal
      title="Upload a File"
      open={visible}
      onCancel={onCancel}
      wrapClassName={forgotPwModal}
      footer={null}
      closable={false}
  >
    <div className={forgotPwContent}>
      <div className={uploadWrapper}>
        <div className={label}>File</div>
        <Upload
            name="select"
            className={selectWrapper}
            maxCount={1}
            action=""
            beforeUpload={beforeUpload}
            onChange={handleChange}
        >
          <p>Choose a csv /xlsx/xls file to import your contacts</p>
          <div className={selectBtn}>Select</div>
        </Upload>
        <div className={sample} onClick={onSampleClick}>Sample file</div>
      </div>
      <div className={uploadWrapper}>
        <div className={label}>Group</div>
        <div>
          <p>Select the group label for your contacts</p>
        {
          groupList.length > 0
              ? <Select
                  className={addressValue}
                  onChange={value => setGroupName(value)}  // 处理下拉框的变化
                  options={groupList.map((item, index) => ({
                    value: item.groupName,
                    label: item.groupName
                  }))}
              />
              : <Input
                  //placeholder="Use commas to separate multiple words or phrases"
                  className={addressValue}
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}  // 处理输入框的变化
              />
        }
        </div>
      </div>

      <div className={uploadWrapper}>
        <div className={label}>Subscription type</div>
        <div><p>Choose the subscription type of your contacts</p>
          <Select
              placeholder="* Subscription type"
              value={subscriptionType}
              onChange={value => setSubscriptionType(value)}
              className={addressValue}
          >
            <Option value="Subscribed">Subscribed contact</Option>
            <Option value="Unsubscribed">Unsubscribed contact</Option>
            <Option value="Non-subscribed">Non-subscribed contact</Option>
          </Select>
        </div></div>

      {
        available ?
            <div className={addressBtn} onClick={!isProcessing? onImport:undefined}>Import</div>
            :
            <div className={addressBt}>Import</div>
      }
      <div className={cancelBtn} onClick={onCancel}>Cancel</div>
    </div>
  </Modal>;
};

export default UploadModal;
