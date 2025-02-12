import { headers } from "next/headers";
import mailuServerFetch from "@/helper/mailuServerFetch";

const mailuRouteHandler = async (request: Request) => {
    const headersList = headers()
    const token = headersList.get('token') || ''
    const authorization = headersList.get('Authorization') || ''
    const pathname = new URL(request.url).pathname.replace('/api4', '/api') + new URL(request.url).search;
    const contentType = request.headers.get('Content-Type') || 'application/json';
    const method = request.method;
    const text = await request.text()
    const result = await mailuServerFetch({
        url: pathname,
        method,
        data: text,
        contentType,
        token,
        Authorization: authorization
    })
    if (result.status === 200) {
        const res = await result.json()
        return Response.json(res);
    }
    return Response.json({ code: result.status });
};

export default mailuRouteHandler;
