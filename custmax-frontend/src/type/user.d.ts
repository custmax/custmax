declare module User {
  type UserSign = {
    company: string,
    country: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    phone: string,
    encode?: string,
  }

  type UserShown = {
    company: string,
    country: string,
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    avatar: string,
    id: number,
    permission?: number,
  }
}