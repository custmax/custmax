import clientFetch from '@/helper/clientFetch';

export const getCaptcha = async () => {
  const res = await clientFetch({
    url: `/api/captcha/getCaptcha`,
    method: 'GET',
  })
  return res;
}