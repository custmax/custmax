import clientFetch from '@/helper/clientFetch';

export const unsubscribeCampaign = async (email: string) => {
    const res = await clientFetch({
        url: `/api/unsubscribe/campaign`,
        method: 'GET',
        data: {
            email: email
        }
    })
    return res;
}