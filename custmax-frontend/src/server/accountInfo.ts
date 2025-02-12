import clientFetch from '@/helper/clientFetch';

export const getAccountInfo = async () => {
  const res = await clientFetch({
    url: `/api/accountInfo/get`,
    method: 'GET',
  })
  return res;
}

export const getAddr = async () => {
  const res = await clientFetch({
    url: `/api/accountInfo/getAddress`,
    method: 'GET',
  })
  return res;
}

export const saveAccountInfo = async (data: Info.AccountInfo) => {
  const res = await clientFetch({
    url: `/api/accountInfo/save`,
    method: 'POST',
    data,
  })
  return res;
}

export const updateAccountInfo = async (data: Info.AccountInfo) => {
  const res = await clientFetch({
    url: `/api/accountInfo/update`,
    method: 'POST',
    data,
  })
  return res;
}

