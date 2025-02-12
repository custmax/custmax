import clientFetch from '@/helper/clientFetch';

export const getLastCampaignId = async () => {
  const res = clientFetch({
    url: '/api/campaign/getLastCampaignId',
    method: 'GET',
  })
  return res;
}

export const getCampaignPage = async ( page: number, limit: number,query: Record<string, string>) => {
  const res = await clientFetch({
    url: `/api/campaign/getPage/${limit}/${page}`,
    method: 'GET',
    data: query,
  })
  return res;
}

export const getContactByGroup = async (groupId: number | undefined) => {
  const res = clientFetch({
    url: '/api/campaign/getContacts',
    method: 'POST',
    data: groupId,
  })
  return res;
}



export const saveDraft = async (data: Partial<Campaign.CampaignNew>) => {
  const res = await clientFetch({
    url: `/api/campaign/saveDraft`,
    method: 'POST',
    data: { ...data, id: 0 }
  })
  return res;
}

export const getCampaign = async (id: string) => {
  const res = await clientFetch({
    url: `/api/campaign/get/${id}`,
    method: 'GET',
  })
  return res;
}
export const removeCampaign = async (id: string) => {
  return await clientFetch({
    url: `/api/campaign/remove/${id}`,
    method: 'DELETE',
  });
}

export const updateCampaign = async (data: Partial<Campaign.CampaignNew>) => {
  const res = await clientFetch({
    url: `/api/campaign/update`,
    method: 'POST',
    data
  })
  return res;
}

export const getEmailList = async (togroup:number)=>{
  const res = await clientFetch({
    url: `/api/campaign/emailList/${togroup}`,
    method: 'GET',
  })
  return res;
}
export const generateContent = async (contacts:number[])=>{
  const res = await clientFetch({
    url: `/api/generate/generate`,
    method: 'POST',
    data: contacts,
  })
  return res;
}

export const sendEmail = async (data: Campaign.CampaignNew, campaignId: string | null) => {
  let campaignIdNumber = Number(campaignId);
  // 检查转换是否成功
  if (isNaN(campaignIdNumber)) {
    campaignIdNumber = 0
  }
  const res = await clientFetch({
    url: `/api/campaign/sendEmail`,
    method: 'POST',
    data: { ...data,id:campaignIdNumber }
  })
  return res;
}
