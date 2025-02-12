export const valid = async (address:string)=> {
    const query = new URLSearchParams({address: address}).toString();

    const resp = await fetch(
        `https://api.mailgun.net/v4/address/validate?${query}`,
        {
            method: 'GET',
            headers: {
                Authorization: 'Basic ' + Buffer.from('api:88afb8030841f9b9da098e9eac52a164-ed54d65c-307e17c7').toString('base64')
            }
        }
    );

    const data = await resp.json();
   return data
}

