'use client'
import * as domain from "node:domain";

export type LocalUser = {
  firstName?: string,
  lastName?: string,
  email?: string,
  avatar?: string,
  id?: number,
}

export const getToken = () => {
  const token = window.localStorage.getItem('token');
  if (!token) {
    return '';
  }
  const tokenData = JSON.parse(token);
  if (Date.now() > tokenData.expiresAt) {
    // Token 已过期，删除 token
    window.localStorage.removeItem('token');
    return '';
  }
  return tokenData.value;

};

export const setToken = (token: string) => {
  const expiresIn = 14*24*3600;
  const expiresAt = Date.now() + expiresIn * 1000; // 转换为毫秒
  const tokenData = JSON.stringify({ value: token, expiresAt });
  window.localStorage.setItem('token', tokenData);
};

export const clearToken = () => {
  window.localStorage.removeItem('token')
}

export const getLocalUser = () => {
  const localUserStr = window.localStorage.getItem('localUser') || ''
  if (localUserStr) {
    const localUserObj = JSON.parse(localUserStr) as LocalUser;
    return localUserObj
  }
  return null
}

export const setLocalUser = (user: LocalUser) => {
  const localUser = getLocalUser() || {}
  const newLocalUser = { ...localUser, ...user }
  const newLocalUserStr = JSON.stringify(newLocalUser)
  window.localStorage.setItem('localUser', newLocalUserStr);
}

export const clearLocalUser = () => {
  window.localStorage.removeItem('localUser');
};