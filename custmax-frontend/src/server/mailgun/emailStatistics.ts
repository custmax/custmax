export const SenderStatistics = async (sender: string,campaignName:string) => {
    const acceptedQuery = new URLSearchParams({
        tag: `sender:${sender}`+'/'+`campaignName:${campaignName}`,
        event: 'accepted',

    }).toString();

    const deliveredQuery = new URLSearchParams({
        tag: `sender:${sender}`+'/'+`campaignName:${campaignName}`,
        event: 'accepted',

    }).toString();

    const openedQuery = new URLSearchParams({
        tag: `sender:${sender}`+'/'+`campaignName:${campaignName}`,
        event: 'opened',

    }).toString();

    const clickedQuery = new URLSearchParams({
        tag: `sender:${sender}`+'/'+`campaignName:${campaignName}`,
        event: 'clicked',

    }).toString();

    const domain = 'email-marketing-hub.com';

    const deliverResp = await fetch(
        `https://api.mailgun.net/v3/${domain}/tag/stats?${deliveredQuery}`,
        {
            method: 'GET',
            headers: {
                Authorization: 'Basic ' + Buffer.from('api:88afb8030841f9b9da098e9eac52a164-ed54d65c-307e17c7').toString('base64')
            }
        }
    );
    const acceptResp = await fetch(
        `https://api.mailgun.net/v3/${domain}/tag/stats?${acceptedQuery}`,
        {
            method: 'GET',
            headers: {
                Authorization: 'Basic ' + Buffer.from('api:88afb8030841f9b9da098e9eac52a164-ed54d65c-307e17c7').toString('base64')
            }
        }
    );

    const openResp = await fetch(
        `https://api.mailgun.net/v3/${domain}/tag/stats?${openedQuery}`,
        {
            method: 'GET',
            headers: {
                Authorization: 'Basic ' + Buffer.from('api:88afb8030841f9b9da098e9eac52a164-ed54d65c-307e17c7').toString('base64')
            }
        }
    );

    const clickedResp = await fetch(
        `https://api.mailgun.net/v3/${domain}/tag/stats?${clickedQuery}`,
        {
            method: 'GET',
            headers: {
                Authorization: 'Basic ' + Buffer.from('api:88afb8030841f9b9da098e9eac52a164-ed54d65c-307e17c7').toString('base64')
            }
        }
    );

    const accept = await acceptResp.json();
    const open = await openResp.json();
    const click = await clickedResp.json();
    const deliver = await deliverResp.json();
    const data = []
    data.push(deliver.stats[7].accepted.total,open.stats[7].opened.unique===undefined ? 0 :open.stats[7].opened.unique,click.stats[7].clicked.total)
    return data;
    // const opened_rate = open.stats[7].opened.unique===0 || open.stats[7].opened.unique===undefined ? 0 : open.stats[7].opened.unique/accept.stats[7].accepted.total;
    // //计算当日打开率
    // const clicked_rate = click.stats[7].clicked.total===0 ? 0 : click.stats[7].clicked.total/accept.stats[7].accepted.total;
    // const delivered_rate = deliver.stats[7].accepted.total===0 ? 0 : deliver.stats[7].accepted.total/accept.stats[7].accepted.total;


}

export default SenderStatistics;