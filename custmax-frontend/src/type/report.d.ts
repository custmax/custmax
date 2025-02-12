declare module Report {
  type ReportItem = {
    id: number,
    sendTime: string,
    deliverCount: number,
    delivered: number,
    opened: number,
    clicked: number,
    campaignName: string,
    groupName: string,
  }
}