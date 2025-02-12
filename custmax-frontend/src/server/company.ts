
import clientFetch from '@/helper/clientFetch';

export const getPlanDetail = async () => {
  const res = await clientFetch({
    url: `/api/company/getPlanDetail`,
    method: 'GET',
  })
  return res;
}
