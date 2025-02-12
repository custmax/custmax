import clientFetch from '@/helper/clientFetch';
import {getToken} from "@/util/storage";


export const getPay = async (id: number) => {
    const response = await fetch(`/api/payByStripe?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': getToken() // 如果需要发送 token
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    return response.json();
}