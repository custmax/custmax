import clientFetch from '@/helper/clientFetch';
import { getToken } from '@/util/storage';
import {SetStateAction} from "react";


export const sendVerifyCode = async (email: string) => {
  const res = await clientFetch({
    url: '/api/user/sendVerifyCode',
    method: 'POST',
    data: { email },
    contentType: 'application/x-www-form-urlencoded',
  })
  return res;
}

export const sendPhoneCode = async (prefix: string)=>{
  const res = await clientFetch({
    url: '/api/user/sendPhoneCode',
    method: 'POST',
    data: { prefix },
    contentType: 'application/x-www-form-urlencoded',
  })
  return res;
}

// 假设 userData 类型定义
interface userData {
  nickname: string;
  email: string;
  password: string;
  // 可选的 Turnstile 令牌
  turnstileToken?: string;
}

export const register = async (info: userData) => {
  console.log({...info}); // 输出用户信息以供调试

  try {
    const res = await clientFetch({
      url: '/api/user/register',
      method: 'POST',
      data: info, // 直接传递 info，若需要可以在这里添加其他字段
    });

    return res;
  } catch (error) {
    console.error('注册请求失败:', error);
    throw new Error('注册请求失败');
  }
};

export const registerForInvited = async (info: User.UserSign, encode: string) => {
  const res = await clientFetch({
    url: `/api/user/registerForInvited?encode=${encode}`,
    method: 'POST',
    data: info
  })
  return res;
}


export const login = async (data: Pick<User.UserSign, 'email' | 'password'>) => {
  const res = await clientFetch({
    url: '/api/user/login',
    method: 'POST',
    data
  })
  return res;
}

export const islogin = async () => {
  // 从 localStorage 获取 token（或其他存储方式）
  const token = getToken(); // 确保 token 已存储在 localStorage 中

  const res = await clientFetch({
    url: '/api/Ebooks/user/islogin',
    method: 'GET',
    headers: {
      'token': token, // 将 token 添加到请求头
    },
  });

  return res;
}

export const uploadAvatar = async (data: FormData) => {
  const token = getToken() || ''
  const result = await fetch('/api/user/uploadAvatar', {
    method: "POST",
    body: data,
    headers: {
      token,
    }
  })
  const res = await result.json()
  return res;
}

export const getUserInfo = async () => {
  const res = await clientFetch({
    url: '/api/user/getUserInfo',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded',
  })
  return res;
}

export const updateUser = async (data: User.UserShown) => {
  const res = await clientFetch({
    url: '/api/user/update',
    method: 'PUT',
    data
  })
  return res;
}

export const updatePassword = async (data: { newPassword: string, oldPassword: string }) => {
  const res = await clientFetch({
    url: '/api/user/updatePassword',
    method: 'POST',
    data
  })
  return res;
}

export const sendCodeForPassword = async (data: { email: string }) => {
  const res = await clientFetch({
    url: '/api/user/sendCodeForPassword',
    method: 'POST',
    data,
    contentType: 'application/x-www-form-urlencoded'
  })
  return res;
}

export const sendEmailForResetPassword = async (data: { email: string }) => {
  const res = await clientFetch({
    url: '/api/user/sendEmailForResetPassword',
    method: 'POST',
    data,
    contentType: 'application/x-www-form-urlencoded'
  })
  return res;
}

export const forgetPassword = async (data: { email: string, password: string, verifyCode: string }) => {
  const res = await clientFetch({
    url: '/api/user/forgetPassword',
    method: 'POST',
    data
  })
  return res;
}

export const getUserList = async (page: number, limit: number) => {
  const res = await clientFetch({
    url: `/api/user/getUserList/${page}/${limit}`,
    method: 'GET',
  })
  return res;
}

export const getRegisterStatus = async (uuId: string | null) => {
  const res = await clientFetch({
    url: `/api/user/checkUuid/${uuId}`,
    method: 'GET',
  })
  return res;
}

export const invite = async (email: string) => {
  const res = await clientFetch({
    url: `/api/user/invite`,
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    data: { email }
  })
  return res;
}

export const addAdmin = async (userId: number) => {
  const res = await clientFetch({
    url: `/api/user/addAdmin?userId=${userId}`,
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
  })
  return res;
}

export const removeAdmin = async (userId: number) => {
  const res = await clientFetch({
    url: `/api/user/removeAdmin?userId=${userId}`,
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
  })
  return res;
}

export const removeUser = async (userId: number) => {
  const res = await clientFetch({
    url: `/api/user/removeUser?userId=${userId}`,
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
  })
  return res;
}
