// resetPassword.ts
import clientFetch from '@/helper/clientFetch';

export const forgetPassword = async (email: string, password: string) => {
    const res = await clientFetch({
        url: '/api/user/forgetPassword',
        method: 'POST',
        data: { email, password },
        contentType: 'application/x-www-form-urlencoded',
    });
    return res;
};

