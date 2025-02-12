import clientFetch from '@/helper/clientFetch';

export const getOrderHistory = async (page: number, limit: number) => {
  const res = await clientFetch({
    url: `/api/orderHistory/getList/${page}/${limit}`,
    method: 'GET',
  })
  return res;
}
