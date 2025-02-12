import { getToken } from "@/util/storage";


type RequestOptions = {
  url: string,
  method: string,
  data?: any,
  contentType?: string,
  Authorization?: string,
  headers?: { [key: string]: string }; // 添加 headers 属性
}

const request = async (options: RequestOptions) => {
  const {
    url,
    data,
    method = 'GET',
    contentType = 'application/json;charset=UTF-8',
    Authorization ,
  } = options;
  const parsedMethod = method.toLocaleUpperCase();
  let fetchUrl = url;
  let fetchOpt: RequestInit = {}
  let headers = {}
  if ( Authorization != null && Authorization.length > 0){
    headers = { ...headers, Authorization }
  }
  if (parsedMethod === 'GET') {
    if (data) {
      const parsedData = new URLSearchParams(data).toString()
      fetchUrl = `${fetchUrl}?${parsedData}`
    }
    const token = getToken() || ''
    headers = { ...headers, token }
    fetchOpt = { ...fetchOpt, method: parsedMethod, headers }
  }
  if (parsedMethod === 'POST' || parsedMethod === 'PUT' || parsedMethod === 'DELETE') {

    const token = getToken() || ''
    headers = { ...headers, 'Content-Type': contentType, token }

    let body =''
    if (contentType.includes('application/json')) {
      // function(k, v) { return v === undefined ? null : v; }
      body = JSON.stringify(data,function(k, v) { return v === undefined ? null : v; })
    }
    if (contentType.includes('application/x-www-form-urlencoded')) {
      body = new URLSearchParams(data).toString()
    }

    fetchOpt = { ...fetchOpt, headers, body, method: parsedMethod }
  }
  const result = await fetch(fetchUrl, fetchOpt)
  const res = await result.json()
  if (res.code === 401) {
    window.location.replace("/login");
  }
  return res;
}

export default request;