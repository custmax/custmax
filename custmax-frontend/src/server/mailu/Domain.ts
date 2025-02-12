import {API_AUTH} from "@/server/mailu/mailu";

export const createdomain = async (domain: string | null) => {
    const body = {
        name: domain
    }
    const response = await fetch('/api4/v1/domain', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${API_AUTH}`
        },
        body: JSON.stringify(body), // 注意这里要将数据转换为 JSON 字符串
    });

    const res = await response.json();
    return res;
}

export const generateDkim = async (domain: string | null) => {

    const response = await fetch(`/api4/v1/domain/${domain}/dkim`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${API_AUTH}`
        },
    });

    const res = await response.json();
    console.log(res)
    return res;
}


export const getdomain = async (domain: string | null) => {//获取domain信息
    const response = await fetch(`/api4/v1/domain/${domain}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${API_AUTH}`
        },
    });
    const res = await response.json();
    return res;
}