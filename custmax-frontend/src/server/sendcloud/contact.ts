import {API_BASE64} from "@/constant/sendCloud";
import UpdateContact = Contact.UpdateContact;
import AddContact = Contact.AddContact;


export const getContactList = async (offset: number, count: number) => {
    const res = await fetch(
        `/api3/marketing/lists/listMembers?offset=${offset}&count=${count}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`,
                'Content-Type': 'application/json; charset=utf-8'
            }
        }
    )
    return res;
}

export const getContactDetail = async (memberId: string) => {
    const res = await fetch(
        `/api3/marketing/lists/members/${memberId}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`
            }
        }
    )
    return res;
}

export const updateContact = async (memberId: string, data: UpdateContact) => {
    const res = await fetch(
        `/api3/marketing/lists/members/${memberId}`,
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

export const removeContact = async (memberId: string) => {
    const res = await fetch(
        `/api3/marketing/lists/members/${memberId}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`,
            }
        }
    )
    return res;
}

export const saveContact = async (data: AddContact) => {
    const res = await fetch(
        `/api3/marketing/lists/members`,
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

