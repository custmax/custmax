'use client'

import styles from './index.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import ImgWrapper from '../ImgWrapper';
import { Tooltip } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import ChangePwModal from '../ChangePwModal';
import { getLocalUser } from '@/util/storage';
import { clearToken } from '@/util/storage';

type Props = {
  avatar?: string,
}


const {
  headerContainer,
  logoBox,
  right,
  notification,
  avatar,
  arrowDown,
  tooltip,
  nickname,
} = styles;

const Header: FC<Props> = (props) => {
  const [showChangePw, setShowChangePw] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>()
  const [localAvatar, setLocalAvatar] = useState<string>('')

  useEffect(() => {
    initLocal()
  }, [])

  const initLocal = () => {
    const localUser = getLocalUser() || {}
    if (localUser.firstName) {
      setFirstName(localUser.firstName)
    }
    if (localUser.avatar) {
      setLocalAvatar(localUser.avatar)
    }
  }

  const onChangePwOk = () => {
    setShowChangePw(false)
  }

  const onChangePwCancel = () => {
    setShowChangePw(false)
  }

    return <div className={classNames(headerContainer)} id='enterHeader'>
        <Link href='/'>
            <ImgWrapper className={logoBox} alt='logo' src='/img/logo.png'/>
        </Link>
        <div className={right}>
            {/*<Link href='/stationMessage'>*/}
            {/*  <ImgWrapper className={notification} alt='notification icon' src='/img/notification_icon.png'/>*/}
            {/*</Link>*/}
            <ImgWrapper
                className={avatar}
                alt='avatar'
                src={props.avatar || localAvatar || '/img/default-avatar.png'}
            />

            <Tooltip
                placement="bottomRight"
                className={tooltip}
                title={
                    <div className='more'>
                        <Link href='/dashboard' className="more-item">Dashboard</Link>
                        <Link href='/contactInfo' className='more-item'>Information</Link>
                        <Link href='/userList' className='more-item'>Users</Link>
                        <div className='more-item' onClick={() => setShowChangePw(true)}>Reset Password</div>
                        <Link href='/billingHistory' className='more-item'>Billing</Link>
                        <Link href='/emailList' className="more-item">Sender</Link>
                        <Link href='/' className='more-item mb0' onClick={clearToken}>Sign Out</Link>
                    </div>}
                getPopupContainer={() => document.querySelector('#enterHeader') || document.body}
            >
                <span className={nickname}>{firstName}</span>
                <ImgWrapper className={arrowDown} alt='arrow down' src='/img/arrow_down_999.png'/>
            </Tooltip>
        </div>
        <ChangePwModal
            visible={showChangePw}
            onOk={onChangePwOk}
            onCancel={onChangePwCancel}
        />
    </div>;
};

export default Header;