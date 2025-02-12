async function createDomain(domainName:string) {
    const form = new FormData();
    form.append('name',domainName);

    const resp = await fetch(
        `https://api.mailgun.net/v4/domains`,
        {
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + btoa('api:88afb8030841f9b9da098e9eac52a164-ed54d65c-307e17c7')
            },
            body: form
        }
    );

    const data = await resp.json();
    const records = data.sending_dns_records;
    const DKIM = records[1];
    const SPF = records[0];
    const CNAME = records[2];
    console.log(CNAME)

}

export default createDomain;