'use client'
import EnteredHeader from '@/component/EnteredHeader';
import styles from './page.module.scss';
import SideBar from '@/component/SideBar';
import { Input, Modal, Popconfirm, Select, Space, Table, TableProps, message } from 'antd';
import ImgWrapper from '@/component/ImgWrapper';
import { useEffect, useState } from 'react';
import { TableRowSelection } from 'antd/es/table/interface';
import { SUCCESS_CODE } from '@/constant/common';
import { addAdmin, getUserInfo, getUserList, invite, removeAdmin, removeUser } from '@/server/user';

type DataType = {
  id: number,
  key: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  permission: string,
}

const {
  userListContainer,
  inviteModal,
  inviteContent,
  inputItem,
  label,
  value,
  main,
  title,
  inviteBtn,
  inviteIcon,
  content,
  editIcon,
  removeIcon,
} = styles;

const pageSize = 10;

const permissionList = [
  {value: 0, label: 'Normal'},
  {value: 1, label: 'Admin'},
  {value: 2, label: 'Super Admin'},
]

const UserList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showInvite, setShowInvite] = useState<boolean>(false);
  const [showUserEditor, setShowUserEditor] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userList, setUserList] = useState([])
  const [permission, setPermission] = useState<{ value: number, label: string }>(permissionList[0])
  const [originPermission, setOriginPermission] = useState<{ value: number, label: string }>(permissionList[0])
  const [userIdEditing, setUserIdEditing] = useState(-1)

  const getUserId = async () => {
    const res = await getUserInfo()
    if (res.code === SUCCESS_CODE && res.data) {
      var id = res.data.id;
      return id;
    }
  }

  const initUserInfo = async () => {
    const res = await getUserInfo()
    if (res.code === SUCCESS_CODE && res.data) {
    }
  }

  const initList = async () => {
    message.loading({ content: 'loading', duration: 10, key: 'listLoading' })
    const res = await getUserList(currentPage, pageSize)
    message.destroy('listLoading')
    if (res.code === SUCCESS_CODE) {
      setUserList(res.data?.records.map((item: { id: number }) => ({ ...item, key: item.id })) || [])
    }
  }
  
  useEffect(() => {
    initList();
    initUserInfo();
  }, [])

  const onInviteOk = async () => {
    const res = await invite(email)
    if (res.code === SUCCESS_CODE) {
      message.success(res.message)
    } else {
      message.error(res.message)
    }
    setShowInvite(false)
    setEmail('')
  }

  const onInviteCancel = () => {
    setShowInvite(false)
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onUserEditClick = (permission: number, userId: number) => {
    const newPermissionList = [...permissionList, { value: 2, label: 'Super Admin' }]
    const newPermission = newPermissionList.find(item => item.value === permission);
    if (newPermission) {
      setUserIdEditing(userId)
      setOriginPermission(newPermission)
      setPermission(newPermission)
      setShowUserEditor(true)
    }
  };

  const onUserEditorOk = async () => {
    console.log('originPermission', originPermission)
    console.log('permission', permission)
    if (originPermission.value === 0 && permission.value === 1) {
      const res = await addAdmin(userIdEditing)
      if (res.code === SUCCESS_CODE) {
        message.success(res.message)
        initList();
      } else {
        message.error(res.message)
      }
    }
    if (originPermission.value === 1 && permission.value === 0) {
      const res = await removeAdmin(userIdEditing)
      if (res.code === SUCCESS_CODE) {
        message.success(res.message)
        initList();
      } else {
        message.error(res.message)
      }
    }
  }

  const onUserDelete = async (userId: number) => {
    const res = await removeUser(userId)
    if (res.code === SUCCESS_CODE) {
      message.success(res.message)
      initList();
    } else {
      message.error(res.message)
    }
  }

  const onPermissionChange = (value: number) => {
    const selected = permissionList.find(item => item.value === value)
    if (selected) {
      setPermission(selected)
    }
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (_item, record) => (
        <Space size="middle">
          <span>{record.firstName} {record.lastName}</span>
          <div onClick={() => onUserEditClick(+record.permission, +record.id)}>
            <ImgWrapper className={editIcon} src='/img/edit_icon.png' alt='edit icon' />
          </div>
        </Space>
      ),
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Permission',
      dataIndex: 'permission',
      key: 'permission',
      render: (item) => (
        <Space size="middle">
          <span>{item === 2 ? 'Super Admin' : item === 1 ? 'Admin' : ''}</span>
        </Space>
      ),
    },
    {
      title: 'Remove',
      key: 'remove',
      render: (_item, record) => (
        <Space size="middle">
          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this user?"
            onConfirm={() => onUserDelete(+record.id)}
            okText="Yes"
            cancelText="No"
          >
            <div style={{ marginRight: '1em' }}>
              <ImgWrapper className={removeIcon} src='/img/remove_active_icon.png' alt='remove icon' />
            </div>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  return <div className={userListContainer}>
    <EnteredHeader />
    <SideBar />
    <div className={main}>
      <div className={title}>
        <span>User List</span>
        <div className={inviteBtn} onClick={() => setShowInvite(true)}>
          <ImgWrapper className={inviteIcon} src='/img/invite_icon.png' alt='invide icon' />
          <span>Invite</span>
        </div>
      </div>
      <div className={content}>
        <Table<DataType>
          columns={columns}
          dataSource={userList}
          pagination={{ pageSize: 8 }}
          rowSelection={rowSelection}
        />
      </div>
    </div>
    <Modal
      title="Invite your workmate"
      open={showInvite}
      onOk={onInviteOk}
      onCancel={onInviteCancel}
      wrapClassName={inviteModal}
    >
      <div className={inviteContent}>
        <div className={inputItem}>
          <div className={label}>Email address</div>
          <Input value={email} onChange={e => setEmail(e.target.value)} className={value} />
        </div>
      </div>
    </Modal>
    <Modal
      title="Edit User"
      open={showUserEditor}
      onOk={onUserEditorOk}
      onCancel={() => setShowUserEditor(false)}
      wrapClassName={inviteModal}
    >
      <div className={inviteContent}>
        <div className={inputItem}>
          <div className={label}>Permission</div>
          <Select
            className={value}
            onChange={onPermissionChange}
            value={permission.value}
            options={permissionList}
          />
        </div>
      </div>
    </Modal>
  </div>
};

export default UserList;
