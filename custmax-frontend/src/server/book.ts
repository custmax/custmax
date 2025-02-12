import clientFetch from '@/helper/clientFetch';

export const saveBook = async (data: Record<string, string>) => {
  const res = await clientFetch({
    url: `/api/book/save`,
    method: 'POST',
    data
  })
  return res;
}
