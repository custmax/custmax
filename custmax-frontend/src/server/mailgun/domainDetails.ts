async function domainDetails(domainName:string) {

    const resp = await fetch(
        `https://api.mailgun.net/v4/domains/${domainName}`,
        {
            method: 'GET',
            headers: {
                Authorization: 'Basic ' + btoa('api:88afb8030841f9b9da098e9eac52a164-ed54d65c-307e17c7')
            }
        }
    );

    const data = await resp.json();
    const records = data.sending_dns_records;
    var {name,record_type,value} = records[0];
    const SPF  = {name,record_type,value};
    var {name,record_type,value} = records[1];
    const DKIM = {name,record_type,value};
    var {name,record_type,value} = records[2];
    const CNAME = {name,record_type,value};

}
export default domainDetails;