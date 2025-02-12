
type RequestOptions = {
  url: string,
  method: string,
  data?: any,
  contentType?: string,
  token?: string,
}

const serverFetch = async (options: {
  method: string;
  data: string;
  stripeSignature: string;
  contentType: string;
  url: string;
  token: string
}) => {
  // @ts-ignore
  const { url, method, data, contentType, token, stripeSignature } = options;
  let fetchUrl = `${process.env.NEXT_PUBLIC_HOST}${url}`;
  let fetchOpt: RequestInit = {};
  if (method === 'GET') {
    if (data) fetchUrl = `${fetchUrl}?${data}`;
    const headers = { token, 'Stripe-Signature': stripeSignature } as HeadersInit; // 添加 Stripe-Signature 头
    fetchOpt = { ...fetchOpt, method, headers };
  }
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    const headers = { 'Content-Type': contentType, token, 'Stripe-Signature': stripeSignature } as HeadersInit; // 添加 Stripe-Signature 头
    fetchOpt = { ...fetchOpt, headers, body: data, method };
  }
  return fetch(fetchUrl, fetchOpt);
};

export default serverFetch;
