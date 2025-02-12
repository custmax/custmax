declare module Campaign {
    type SaveCampaign = {
        taskType: number,
        name: string,
        to: string,
        sendListType: string,
        senderId: string,
        replyTo: string,
        templateInvokeName: string,
        runTime: string,
        timeZone: number
    }
}