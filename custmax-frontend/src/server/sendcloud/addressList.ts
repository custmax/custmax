import clientFetch from '@/helper/clientFetch';
import {API_KEY, API_USER} from "@/constant/sendCloud";


export const getAddressList = async () => {
    const res = await clientFetch({
        url: `/api2/addresslist/list`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY
        }
    })
    return res;
}

export const addAddressList = async (address: string, name: string) => {
    const res = await clientFetch({
        url: `/api2/addresslist/add`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            address: address,
            name: name
        }
    })
    return res;
}

export const updateAddressList = async (address: string, newAddress: string, name: string) => {
    const res = await clientFetch({
        url: `/api2/addresslist/update`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            address: address,
            newAddress: newAddress,
            name: name
        }
    })
    return res;
}

export const removeAddressList = async (address: string) => {
    const res = await clientFetch({
        url: `/api2/addresslist/delete`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            address: address
        }
    })
    return res;
}
