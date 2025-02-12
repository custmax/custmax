import clientFetch from '@/helper/clientFetch';

export const getBillingInfo = async () => {
  const res = await clientFetch({
    url: `/api/billingInfo/get`,
    method: 'GET',
  })
  return res;
}

export const saveBillingInfo = async (data: Info.AccountInfo) => {
  const res = await clientFetch({
    url: `/api/billingInfo/save`,
    method: 'POST',
    data,
  })
  return res;
}

export const updateBillingInfo = async (data: Info.AccountInfo) => {
  const res = await clientFetch({
    url: `/api/billingInfo/update`,
    method: 'POST',
    data,
  })
  return res;
}

