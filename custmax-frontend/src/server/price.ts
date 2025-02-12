import clientFetch from '@/helper/clientFetch';

export const getPriceList = async (capacity: number, months: number, currency: number) => {
    const res = await clientFetch({
        url: '/api/price/getList',
        method: 'GET',
        data: {
            contactCapacity: capacity,
            months: months,
            currency: currency,
        }
    })
    return res;
}

export const getContactCapacityList = async () => {
    const res = await clientFetch({
        url: '/api/price/getContactList',
        method: 'GET',
    })
    return res;
}

export const getPlanById = async (id: number) => {
    const res = await clientFetch({
        url: `/api/price/getPlan`,
        method: 'GET',
        data: { id }
    })
    return res;
}