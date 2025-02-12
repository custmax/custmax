import clientFetch from '@/helper/clientFetch';

export const sendCodeForSender = async (email: string) => {
  const res = await clientFetch({
    url: `/api/sender/sendCodeForSender`,
    method: 'POST',
    data: { email },
    contentType: 'application/x-www-form-urlencoded'
  })
  return res;
}

export const checkEmail = async (email:string) => {
  const res = await clientFetch({
    url: `/api/sender/checkEmail/${email}`,
    method: 'GET',
  })
  return res;
}

export const checkuuid = async (uuid: string | null) => {
  const res = await clientFetch({
    url: `/api/sender/check/${uuid}`,
    method: 'GET',
  })
  return res;
}

export const saveSender = async (data: Omit<Sender.SaveSender, 'id'>) => {
  const res = await clientFetch({
    url: `/api/sender/save`,
    method: 'POST',
    data,
  })
  return res;
}

export const getSenderList = async () => {
  const res = await clientFetch({
    url: `/api/sender/getList`,
    method: 'GET',
  })
  return res;
}

export const removeSender = async (id: number) => {
  const res = await clientFetch({
    url: `/api/sender/remove?id=${id}`,
    method: 'DELETE',
  })
  return res;
}

