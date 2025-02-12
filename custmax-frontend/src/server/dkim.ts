import clientFetch from '@/helper/clientFetch';

export const getPublicKey = async (domain: string) => {
    const res = await clientFetch({
        url: `/api/dkim/getPublicKey`,
        method: 'GET',
        data: {domain}
    })
    return res;
}

export const getDkim = async (domain: string) => {
    const res = await clientFetch({
        url: `/api/dkim/get`,
        method: 'GET',
        data: {domain}
    })
    return res;
}