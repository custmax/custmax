export const send = async (from:string,to:string[],subject:string,html:string,deliveryTime:string,ids:number[],address:string,campaignName:string) => {
    const form = new FormData();
    form.append('from', from);
    form.append('to', to.join(','));
    form.append('subject', subject);
    form.append('html', html+`<p style="font-size: 10px; color: #888;">Sender address: ${address}</p>`);

    form.append('o:deliverytime', new Date(deliveryTime).toUTCString());
    form.append('o:tracking-clicks','true')

    const senderTag = `sender:${from}`+'/'+`campaignName:${campaignName}`;
    form.append('o:tag', senderTag);
    const recipientVariables: { [key: string]: {  id: number } } = {};
    ids.forEach((id,index)=>{
        recipientVariables[to[index]] = {  id: ids[index] };
    })

    form.append('recipient-variables',JSON.stringify(recipientVariables));

    const domainName = from.split('@')[1];
    console.log(domainName)
    const resp = await fetch(
        `https://api.mailgun.net/v3/${domainName}/messages`,
        {
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + btoa('api:88afb8030841f9b9da098e9eac52a164-ed54d65c-307e17c7')
            },
            body: form
        }
    );

    const text = await resp.json(); // 存储响应体
    return text;
}
