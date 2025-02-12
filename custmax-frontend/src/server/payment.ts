import clientFetch from '@/helper/clientFetch';

export const paySuccess = async (PayerID: string, paymentId: string) => {
  const res = await clientFetch({
    url: `/api/payment/pay/success`,
    method: 'GET',
    data: { PayerID, paymentId },
  })
  return res;
}

export const payCancel = async () => {
  const res = await clientFetch({
    url: `/api/payment/pay/cancel`,
    method: 'GET',
  })
  return res;
}
