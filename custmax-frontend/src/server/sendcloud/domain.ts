import clientFetch from '@/helper/clientFetch';
import {API_USER, API_KEY} from "@/constant/sendCloud";

export const getDomainList = async () => {
    const res = await clientFetch({
        url: `/api2/domain/list`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
        }
    })
    return res;
}

// export const getUsermessages= async () => {
//     const res = await clientFetch({
//         url: `/api2/apiuser/list`,
//         method: 'GET',
//         data: {
//             apiUser: API_USER,
//             apiKey: API_KEY,
//         }
//     })
//     return res;
// }

export const getDomain = async (name: string | null) => {
    const res = await clientFetch({
        url: `/api2/domain/list`,
        method: 'GET',
        data: {
            name:name,
            apiUser: API_USER,
            apiKey: API_KEY
        }
    })
    return res;
}

export const addDomain = async (name: string) => {
    const res = await clientFetch({
        url: `/api2/domain/add`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            name: name
        }
    })
    return res;
}

export const updateDomain = async (name: string, newName: string) => {
    const res = await clientFetch({
        url: `/api2/domain/update`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            name: name,
            newName: newName,
        }
    })
    return res;
}

export const checkDomain = async (name: string) => {
    const res = await clientFetch({
        url: `/api2/domain/checkConfig`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            name: name,
        }
    })
    return res;
}

export const deleteDomain = async (name: string) => {
    const res = await clientFetch({
        url: `/api2/domain/delete`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            name: name,
        }
    })
    return res;
}



