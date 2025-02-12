import { FC, useState } from 'react';
import styles from './index.module.scss';
import { Input, Modal, message } from 'antd';
import { updatePassword } from '@/server/user';
import { SUCCESS_CODE } from '@/constant/common';

type Props = {
  visible: boolean,
  onOk: () => void,
  onCancel: () => void,
}

const {
  changePwModal,
  changePwContent,
  inputItem,
  label,
  value,
} = styles;

const ChangePwModal: FC<Props> = (props) => {
  const { visible, onOk, onCancel } = props;
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [reTypePassword, setReTypePassword] = useState('')

  const _onOk = async () => {
    if (newPassword !== reTypePassword) {
      return message.error({ content: 'Make sure the two passwords are the same' })
    }
    const data = {
      newPassword,
      oldPassword,
    }
    const res = await updatePassword(data);
    if (res.code === SUCCESS_CODE) {
      message.success(res.message)
    } else {
      message.error(res.message)
    }
    onOk()
  }

  return <Modal
    title="Change Password"
    open={visible}
    onOk={_onOk}
    onCancel={onCancel}
    wrapClassName={changePwModal}
  >
    <div className={changePwContent}>
      <div className={inputItem}>
        <div className={label}>Current Password</div>
        <Input type='password' className={value} value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
      </div>
      <div className={inputItem}>
        <div className={label}>New Password</div>
        <Input type='password' className={value} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
      </div>
      <div className={inputItem}>
        <div className={label}>Retype New Password</div>
        <Input type='password' className={value} value={reTypePassword} onChange={e => setReTypePassword(e.target.value)} />
      </div>
    </div>
  </Modal>
};

export default ChangePwModal;
