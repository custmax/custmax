declare module Contact {
    type Member = {
        email: string,
        phone: string,
        name: string,
        fields: object,
        tags: string[]
    }
    type AddContact = {
        members: Member[],
        tagFlag: number,
        updateExisting: boolean
    }
    type UpdateContact = {
        email: string,
        phone: string,
        name: string,
        fields: object,
        tags: string[]
    }
}