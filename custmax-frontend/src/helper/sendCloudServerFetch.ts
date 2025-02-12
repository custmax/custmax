import {SENDCLOUD_API} from "@/constant/sendCloud";

type RequestOptions = {
  url: string,
  method: string,
  data?: any,
  contentType?: string,
  token?: string,
  Authorization?: string,
}

const sendCloudServerFetch = async (options: RequestOptions) => {
  const { url, method, data, contentType, token, Authorization } = options;
  let fetchUrl = `${SENDCLOUD_API}${url}`;
  let fetchOpt: RequestInit = {}
  let headers = {}
  if ( Authorization != null && Authorization.length > 0){
    headers = { ...headers, Authorization }
  }
  if (method === 'GET') {
    if (data) fetchUrl = `${fetchUrl}?${data}`;
    headers = { ...headers, token }
    fetchOpt = { ...fetchOpt, method, headers }
  }
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    headers = { ...headers, 'Content-Type': contentType, token }
    fetchOpt = { ...fetchOpt, headers, body: data, method }
  }
  return fetch(fetchUrl, fetchOpt)
}

export default sendCloudServerFetch;