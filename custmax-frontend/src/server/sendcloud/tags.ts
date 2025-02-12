import {API_BASE64} from "@/constant/sendCloud";

export const getTagList = async (offset: number, count: number, tagName?: string) => {
    const res = await fetch(
        `/api3/marketing/lists/tags?offset=${offset}&count=${count}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`
            }
        }
    )
    return res;
}

export const saveTag = async (tagName: string) => {
    const res = await fetch(
        `/api3/marketing/lists/tags`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                tagName: tagName
            })
        }
    )
    return res;
}

export const updateTag = async (tagId: string, tagName: string) => {
    const res = await fetch(
        `/api3/marketing/lists/tags/${tagId}`,
        {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                tagName: tagName
            })
        }
    )
    return res;
}

export const deleteTag = async (tagId: string) => {
    const res = await fetch(
        `/api3/marketing/lists/tags/${tagId}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`
            }
        }
    )
    return res;
}

export const getTagMember = async (tagId: string, offset: number, count: number) => {
    const res = await fetch(
        `/api3/marketing/lists/tags/${tagId}/members?offset=${offset}&count=${count}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`
            }
        }
    )
    return res;
}