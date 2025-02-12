import clientFetch from '@/helper/clientFetch';

export const domainVerify = async (domain: string | null) => {
    const res = await clientFetch({
        url: `/api/domain/verify`,
        method: 'POST',
        data: {domain},
        contentType: 'application/x-www-form-urlencoded',
    })
    return res;
}

export const SavedomainSender = async (email: string | null, password: string) => {
    const res = await clientFetch({
        url: `/api/sender/savedomainsender`,
        method: 'POST',
        contentType: 'application/json',
        data: {email,password}
    })

    return res;
}

export const saveDkim = async (domain: string | null,dkimValue:string,dmarcValue:string) => {

    const body = {
        domain:domain,
        dkim:dkimValue,
        dmarcValue:dmarcValue
    }
    const res = await clientFetch({
        url: `/api/dkim/save`,
        method: 'POST',
        data: body
    })
    console.log(body)
    return res;
}

export const getDomainList = async () =>{
    const res = await clientFetch({
        url: `/api/domain/getList`,
        method: 'GET',
    })
    return res;
}

export const saveDomain = async (data:Apidomain.NewApidomain) =>{
    console.log(data)
    const res = await clientFetch({
        url: `/api/domain/save`,
        method: 'POST',
        data: data
    })
    return res;

}