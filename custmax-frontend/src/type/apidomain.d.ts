declare module Apidomain {
    type NewApidomain = {
        dkimDomain: string;
        dkimValue: string;
        cnameDomain?:string;
        cnameValue?:string;
        dmarcDomain?: string;
        dmarcValue?: string;
        mxDomain: string;
        mxValue: string;
        domain: string;
        spfDomain: string;
        spfValue: string;
    }
}
