import clientFetch from '@/helper/clientFetch';
import { getToken } from '@/util/storage';

export const getList = async (page: number, limit: number, keyword?: string, groupId?: number,subscriptionType?:string) => {
  const res = await clientFetch({
    url: `/api/contact/getList/${page}/${limit}`,
    method: 'GET',
    data: { keyword: keyword || '', groupId: groupId || '' ,subscriptionType:subscriptionType || ''},
  })
  return res;
}

export const getGroup = async (selectType: string, selectOption: string) => {
  const res = await clientFetch({
    url: `/api/contact/getGroup`,
    method: 'POST',
    data:{selectType, selectOption },
  })
  return res;
}

export const getAllContact = async (searchVal:string) => {
  const res = await clientFetch({
    url: `/api/contact/getAllContact`,
    method: 'POST',
    data: searchVal
  })
  return res;
}

export const getHistoryList = async (page: number, limit: number) => {
  const res = await clientFetch({
    url: `/api/contact/getList/${page}/${limit}`,
    method: 'GET',
  })
  return res;
}

export const addContact = async (data: Contact.NewContact) => {
  const res = await clientFetch({
    url: `/api/contact/add`,
    method: 'POST',
    data: {
      id: 0,
      ...data,
    }
  })
  return res;
}

export const updateContact = async (data: Contact.NewContact) => {
console.log(data)
  const res = await clientFetch({
    url: `/api/contact/update`,
    method: 'POST',
    data,
  })
  return res;
}



export const uploadAvatar = async (data: FormData) => {
  const token = getToken() || ''
  const result = await fetch('/api/contact/uploadAvatar', {
    method: "POST",
    body: data,
    headers: {
      token,
    }
  })
  const res = await result.json()
  return res;
}

export const removeContact = async (data: number[]) => {
  const res = await clientFetch({
    url: `/api/contact/batchRemove`,
    method: 'DELETE',
    data,
  })
  return res;
}

export const getContact = async (contactId: number) => {
  const res = await clientFetch({
    url: `/api/contact/getById/${contactId}`,
    method: 'GET',
  })
  return res;
}
// 定义 generateByGroup 方法

export const generateByGroup = async (payload: { groupId: string; content: string; }) => {
  const res = await clientFetch({
    url: `/api/generate/generateByGroup`,
    method: 'POST',
    data: payload, // 将整个对象作为请求体发送
  });
  return res;
};

export const generateByPerson = async (groupId: number | undefined) => {
  const res = clientFetch({
    url: '/api/generate/generateByPerson',
    method: 'POST',
    data: groupId,
  })
  return res;
}

export const batchImport = async (data: FormData) => {
  const token = getToken() || ''
  const result = await fetch('/api/contact/batchImport', {
    method: "POST",
    body: data,
    headers: {
      token,
    }
  })
  const res = await result.json()
  return res;
}
export const batchImportResult = async () => {
  const token = getToken() || ''
  const result = await fetch('/api/contact/batchImportResult', {
    method: "GET",
    headers: {
      token,
    }
  })
  const res = await result.json()
  return res;
}
export const parseFields = async (data: FormData) => {
  const token = getToken() || ''
  const result = await fetch('/api/contact/parseFields', {
    method: "POST",
    body: data,
    headers: {
      token,
    }
  })
  const res = await result.json()
  return res;
}

export const getEmailsByGroupId = async (groupId: number) => {
  const res = await clientFetch({
    url: `/api/contact/getAll/${groupId}`,
    method: 'GET'
  })
  return res;
}

export const deleteGroup = async (groupIds : number[]) => {
  const res = await clientFetch({
    url: `/api/contact/deleteGroup`,
    method: 'DELETE',
    data: groupIds
  })
  return res;
}

export const deleteContact = async (ContactIds : number[]) => {
  const res = await clientFetch({
    url: `/api/contact/deleteContact`,
    method: 'DELETE',
    data: ContactIds
  })
  return res;
}
