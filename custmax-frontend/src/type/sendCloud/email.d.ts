declare module Email {
    type Send = {
        apiUser: string,
        apiKey: string,
        from: string,
        to: string,
        subject: string,
        html: string,
        contentSummary: string,
        fromName: string,
    }
}
