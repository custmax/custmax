import clientFetch from '@/helper/clientFetch';
import {API_KEY, API_USER} from "@/constant/sendCloud";


export const getMemberList = async (address: string, start: number, limit: number) => {
    const res = await clientFetch({
        url: `/api2/addressmember/list`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            address: address,
            start: start,
            limit: limit
        }
    })
    return res;
}

export const getMember = async (address: string, members: string) => {
    const res = await clientFetch({
        url: `/api2/addressmember/get`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            address: address,
            members: members
        }
    })
    return res;
}

export const addMember = async (address: string, members: string, names: string) => {
    const res = await clientFetch({
        url: `/api2/addressmember/add`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            address: address,
            members: members,
            names: names
        }
    })
    return res;
}

export const updateMember = async (address: string, members: string, newMembers: string, names: string) => {
    const res = await clientFetch({
        url: `/api2/addressmember/update`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            address: address,
            members: members,
            newMembers: newMembers,
            names: names
        }
    })
    return res;
}

export const removeMember = async (address: string, members: string) => {
    const res = await clientFetch({
        url: `/api2/addressmember/delete`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            address: address,
            members: members,
        }
    })
    return res;
}