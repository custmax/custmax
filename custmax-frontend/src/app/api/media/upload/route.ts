import { headers } from 'next/headers'

export const POST = async (request: Request) => {
  const headersList = headers()
  const token = headersList.get('token')
  const pathname = new URL(request.url).pathname.replace('/api', '');
  const method = request.method;
  const formData = await request.formData()
  const result = await fetch(`${process.env.NEXT_PUBLIC_HOST}${pathname}`, {
    method,
    body: formData,
    headers: { token } as HeadersInit,
  })
  if (result.status !== 200) {
    return Response.json({ code: 401 });
  }
  const res = await result.json()
  return Response.json(res);
};