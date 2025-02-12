declare module Campaign {
  type CampaignNew = {
    campaignName: string,
    content: string,
    id?: number,
    preText: string,
    sendTime: string,
    senderId: number,
    senderName: string,
    subject: string,
    toGroup: number,
    trackClicks: boolean,
    trackLink: boolean,
    trackOpens: boolean,
    trackTextClicks: boolean
  }
}