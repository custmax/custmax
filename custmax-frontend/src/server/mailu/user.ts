import {API_AUTH} from "@/server/mailu/mailu";
import {FAILUE_CODE, SUCCESS_CODE} from "@/constant/common";

export const getUser = async (email: string | null) => {
    const response = await fetch(`/api4/v1/user/${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${API_AUTH}`
        },
    });
    const res = await response.json();
    return res.code !== FAILUE_CODE;

}

export const createUser = async (email: string | null,password:string) => {
    const body = {
        email: email,
        raw_password:password,
        enabled:true,
        spam_mark_as_read:true,
        spam_threshold:80,
    }
    const response = await fetch(`/api4/v1/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${API_AUTH}`
        },
        body: JSON.stringify(body),
    });
    const res = await response.json();
    console.log(res);

}