import clientFetch from '@/helper/clientFetch';

export const submitOrder = async (data: Order.OrderNew, planId: string) => {
  const res = await clientFetch({
    url: `/api/orderInfo/submitOrder?planId=${planId}`,
    method: 'POST',
    data,
  })
  return res;
}
