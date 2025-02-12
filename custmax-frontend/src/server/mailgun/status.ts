export const getstatus = async ()=> {
    const domainName = 'email-marketing-hub.com';
    const messageId = encodeURIComponent('<20240514083551.08b5a2abf19534a5@email-marketing-hub.com>');
    const event = 'delivered'
    const resp = await fetch(
        `https://api.mailgun.net/v3/${domainName}/events?message-id=${messageId}&event=${event}&tags=sender:tim@email-marketing-hub.com/campaignName:E`,
        {
            method: 'GET',
            headers: {
                Authorization: 'Basic ' + btoa('api:88afb8030841f9b9da098e9eac52a164-ed54d65c-307e17c7')
            }
        }
    );

    const data = await resp.json();
    console.log(data.items);
}