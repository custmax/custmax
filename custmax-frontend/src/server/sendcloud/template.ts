import clientFetch from '@/helper/clientFetch';
import {API_USER, API_KEY} from "@/constant/sendCloud";

export const getTemplateList = async () => {
    const res = await clientFetch({
        url: `/api2/template/list`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY
        }
    })
    return res;
}

export const getTemplateDetail = async (invokeName: string) => {
    const res = await clientFetch({
        url: `/api2/template/get`,
        method: 'GET',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            invokeName: invokeName
        }
    })
    return res;
}

export const addTemplate = async (invokeName: string, name: string, html: string, subject: string) => {
    const res = await clientFetch({
        url: `/api2/template/add`,
        method: 'POST',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            invokeName: invokeName,
            name: name,
            html: html,
            subject: subject,
            templateType: 1
        },
        contentType: 'application/x-www-form-urlencoded'
    })
    return res;
}

export const removeTemplate = async (invokeName: string) => {
    const res = await clientFetch({
        url: `/api2/template/delete`,
        method: 'POST',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            invokeName: invokeName
        },
        contentType: 'application/x-www-form-urlencoded'
    })
    return res;
}

export const updateTemplate = async (invokeName: string, name?: string, html?: string, subject?: string) => {
    const res = await clientFetch({
        url: `/api2/template/update`,
        method: 'POST',
        data: {
            apiUser: API_USER,
            apiKey: API_KEY,
            invokeName: invokeName,
            name: name,
            html: html,
            subject: subject,
        },
        contentType: 'application/x-www-form-urlencoded'
    })
    return res;
}