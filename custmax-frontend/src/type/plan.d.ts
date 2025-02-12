declare module Plan {
  type PlanItem = {
    contactCapacity: number,
    createTime: string,
    emailCapacity: number,
    id: number,
    name: string,
    priceUSD: number,
    discountUSD: number,
    amountUSD: number,
    updateTime: string,
  }

  type PlanShown = {
    contactCapacity: number,
    emailCapacity: number,
    planName: string,
    contactCount: number | null,
    emailCount: number | null
  }
}