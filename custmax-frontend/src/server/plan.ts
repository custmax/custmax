import clientFetch from '@/helper/clientFetch';

// export const getContactCapacityList = async () => {
//   const res = await clientFetch({
//     url: `/api/plan/price/getContactCapacityList`,
//     method: 'GET',
//   })
//   return res;
// }

export const getPlanByContactCapacity = async (capacity: number) => {
  const res = await clientFetch({
    url: `/api/plan/price/getPlanByContactCapacity`,
    method: 'GET',
    data: { capacity }
  })
  return res;
}

// export const getPlanById = async (id: number) => {
//   const res = await clientFetch({
//     url: `/api/plan/price/getPlanById`,
//     method: 'GET',
//     data: { id }
//   })
//   return res;
// }
