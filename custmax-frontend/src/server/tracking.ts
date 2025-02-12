async function Tracking() {
    const name = 'email-marketing-hub.com';
    const resp = await fetch(
        `https://api.mailgun.net/v3/domains/${name}/tracking`,
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

export default Tracking;
