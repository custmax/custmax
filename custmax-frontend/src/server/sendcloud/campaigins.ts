import {API_BASE64} from "@/constant/sendCloud";
import SaveCampaign = Campaign.SaveCampaign;

export const getCampaignList = async (offset: number, count: number) => {
    const res = await fetch(
        `/api3/marketing/campaigns?offset=${offset}&count=${count}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`,
            }
        }
    )
    return res;
}

export const getCampaignDetail = async (campaignId: string) => {
    const res = await fetch(
        `/api3/marketing/campaigns/${campaignId}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`,
            }
        }
    )
    return res;
}

export const saveCampaign = async (data: FormData) => {
    const res = await fetch(
        `/api3/marketing/campaigns`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`,
            },
            body: data
        }
    )
    return res;
}

export const removeCampaign = async (campaignId: string) => {
    const res = await fetch(
        `/api3/marketing/campaigns/${campaignId}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`,
            }
        }
    )
    return res;
}

export const updateCampaign = async (campaignId: string, data: FormData) => {
    const res = await fetch(
        `/api3/marketing/campaigns/${campaignId}`,
        {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${API_BASE64}`,
            },
            body: data
        }
    )
    return res;
}