import clientFetch from '@/helper/clientFetch';
import { getToken } from '@/util/storage';

export const getMediaList = async (page: number, limit: number, keyword?: string, type?: string) => {
  const res = await clientFetch({
    url: `/api/media/getList/${page}/${limit}`,
    method: 'GET',
    data: { keyword: keyword || '', type: type || '' }
  })
  return res;
}

export const uploadMedia = async (data: FormData) => {
  const token = getToken() || ''
  const result = await fetch('/api/media/upload', {
    method: "POST",
    body: data,
    headers: {
      token,
    }
  })
  const res = await result.json()
  return res;
}

export const removeMedia = async (data: number[]) => {
  const res = await clientFetch({
    url: `/api/media/batchRemove`,
    method: 'DELETE',
    data,
  })
  return res;
}



