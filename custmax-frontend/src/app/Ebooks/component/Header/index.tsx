// This file defines the `Header` component for a Next.js application, utilizing TypeScript, SCSS modules, and various React and third-party components.

'use client'

// Importing necessary modules and components
import styles from './index.module.scss';
import classNames from 'classnames';
import Image from 'next/image';
import Sign from './component/Sign';
import TabBar from './component/TabBar';
import Link from 'next/link';
import {FC, useEffect, useState} from 'react';
import {clearToken, getLocalUser, getToken} from "@/util/storage";
import ImgWrapper from "@/component/ImgWrapper";
import {Tooltip} from "antd";
import ChangePwModal from "@/component/ChangePwModal";

/**
 * Type definition for the props accepted by the Header component.
 * @typedef Props
 * @type {object}
 * @property {boolean} [showBar=false] - Determines if the TabBar component should be displayed.
 * @property {boolean} [showSign=false] - Determines if the Sign component should be displayed.
 * @property {string} [avatar] - URL for the user's avatar image.
 */
type Props = {
  showBar?: boolean,
  showSign?: boolean,
  avatar?: string,
}

// Destructuring class names from styles for easier usage
const {
  headerContainer,
  logoBox,
  logo,
  avatar,
  notification,
  right,
  tooltip,
  nickname,
  arrowDown,
  more,
} = styles;

/**
 * The Header component displays the top navigation bar of the application.
 * It shows a logo, optionally a sign-in component or user information based on authentication status.
 *
 * @component
 * @param {Props} props - The props passed to the component.
 * @returns {JSX.Element} The Header component.
 * header是一个函数组件，接受props类型的变量，返回一个JSX元素
 */
const Header: FC<Props> = (props) => {
  const { showBar = false, showSign = false } = props;//从props中解构showBar和showSign
  const [firstName, setFirstName] = useState<string>()//定义一个firstName的状态变量，初始值为空字符串
  const [localAvatar, setLocalAvatar] = useState<string>('')//定义一个localAvatar的状态变量，初始值为空字符串
  const [showChangePw, setShowChangePw] = useState<boolean>(false);//定义一个showChangePw的状态变量，初始值为false
  const [token, setToken] = useState("")

  // Initializes local user information from storage
  const initLocal = () => {
    const localUser = getLocalUser() || {}//从localStorage中获取localUser，如果没有则为空对象
    if (localUser.firstName) {
      setFirstName(localUser.firstName)
    }
    if (localUser.avatar) {
      setLocalAvatar(localUser.avatar)
    }
  }

  // Handles the "OK" action on the Change Password modal
  const onChangePwOk = () => {
    setShowChangePw(false) //关闭ChangePwModal
  }

  // Handles user sign-out
  const handleSignOut = () => {
    clearToken();//清除token
    window.location.reload();//刷新页面
  };

  // Handles the "Cancel" action on the Change Password modal
  const onChangePwCancel = () => {
    setShowChangePw(false)//关闭ChangePwModal
  }

  // Initializes the authentication token from storage
  const initToken = () => {
    setToken(getToken())
  }

  // Effect hook to initialize token and local user information on component mount
  useEffect(() => {//useEffect是一个副作用钩子，用于在组件挂载时初始化token和local user信息
    initToken()//初始化token
    initLocal();//初始化local user信息
  }, []);

  // Renders the Header component 返回一个div元素，className为headerContainer
  return <div className={classNames(headerContainer)}>
    <Link href='/'>
      {/*点击logo跳转到首页*/}
      <div className={classNames(logoBox)}>
        <Image
          fill
          className={classNames(logo)}
          alt='logo'
          src='/img/logo.png'
          sizes='100%'
          priority//优先加载
        />
      </div>
    </Link>

    {showBar && <TabBar />}
    {/*如果showBar为true，则显示TabBar组件*/}
    {!token ? <Sign /> ://如果token不存在，则显示Sign组件
        <div>
          <div className={right} id="enterHeader">
            {/*否则显示一个div元素，className为right*/}
            <Link href='/stationMessage'>
              <ImgWrapper className={notification} alt='notification icon' src='/img/notification_icon.png'/>
              {/* 点击notification图标跳转到stationMessage*/}
            </Link>
            <ImgWrapper
                className={avatar}
                alt='avatar'
                src={props.avatar || localAvatar || '/img/default-avatar.png'}
            />
            <Tooltip//Tooltip提示框
                placement="bottomRight"//提示框位置
                className={tooltip}//提示框样式
                title={<div className='more'>
                  <Link href='/dashboard' className="more-item">Dashboard</Link>
                  <Link href='/contactInfo' className="more-item">Information</Link>
                  <Link href='/userList' className="more-item">Users</Link>
                  <div className='more-item' onClick={() => setShowChangePw(true)}>Password</div>
                  <Link href='/billingHistory' className="more-item">Billing</Link>
                  <Link href='/emailList' className="more-item">Sender</Link>
                  <Link href='/' className='more-item mb0' onClick={handleSignOut}>Sign Out</Link>
                </div>}
                getPopupContainer={() => document.querySelector('#enterHeader') || document.body}//获取弹出框的容器
            >
              <span className={nickname}>{firstName}</span>
              <ImgWrapper className={arrowDown} alt='arrow down' src='/img/arrow_down_999.png'/>
            </Tooltip>
          </div>
          <ChangePwModal
              visible={showChangePw}//显示ChangePwModal
              onOk={onChangePwOk}//点击确定按钮的回调函数
              onCancel={onChangePwCancel}//点击取消按钮的回调函数
          />
        </div>
    }
  </div>
};

export default Header;