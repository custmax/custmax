import {API_BASE64} from "@/constant/sendCloud";
import NewSender = Sender.NewSender;

export const getSenderList = async (offset: number, count: number) => {
    const res = await fetch(
        `/api3/marketing/senders?offset=${offset}&count=${count}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`
            }
        }
    )
    return res;
}

export const getSenderDetail = async (senderId: number) => {
    const res = await fetch(
        `/api3/marketing/senders/${senderId}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`
            }
        }
    )
    return res;
}

export const saveSender = async (data: NewSender) => {
    const res = await fetch(
        `/api3/marketing/senders`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data)
        }
    )
    return res;
}

export const updateSender = async (senderId: number, data: NewSender) => {
    const res = await fetch(
        `/api3/marketing/senders/${senderId}`,
        {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data)
        }
    )
    return res;
}

export const removeSender = async (senderId: number) => {
    const res = await fetch(
        `/api3/marketing/senders/${senderId}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`,
            }
        }
    )
    return res;
}
