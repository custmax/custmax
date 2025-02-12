import clientFetch from '@/helper/clientFetch';

export const getLastTwoWeeksTemplate = async () => {
  const res = await clientFetch({
    url: `/api/template/getLastTwoWeeks`,
    method: 'GET',
  })
  return res;
}

export const ifRename = async (name:string) => {
  const res = await clientFetch({
    url: `/api/template/ifRename/${name}`,
    method: 'GET',
  })
  return res;
}

export const getPrivateFolderList = async () => {
  const res = await clientFetch({
    url: `/api/template/getPrivateFolder`,
    method: 'GET',
  })
  return res;
}
export const getPublicFolderList = async () => {
  const res = await clientFetch({
    url: `/api/template/getPublicFolder`,
    method: 'GET',
  })
  return res;
}
export const MoveTemplateToFolder = async (data:TemplateMoveToFolder.templateMoveToFolder) => {
  const res = await clientFetch({
    url: `/api/template/moveToFolder`,
    method: 'POST',
    data,
  })
  return res;
}

export const deleteTemplateList = async (data:number[]) => {
  const res = await clientFetch({
    url: `/api/template/batchRemove`,
    method: 'DELETE',
    data,
  })
  return res;
}

export const renameTemplateFolder = async (data: TemplateFolderRename.templateFolderRename) => {
  const res = await clientFetch({
    url: `/api/template/rename`,
    method: 'POST',
    data,
  })
  return res;
}

export const saveTemplate = async (data: Template.TemplateNew) => {
  const res = await clientFetch({
    url: `/api/template/save/customized`,
    method: 'POST',
    data,
  })
  return res;
}

export const updateTemplate = async (data: Template.TemplateNew) => {
  const res = await clientFetch({
    url: `/api/template/update`,
    method: 'POST',
    data,
  })
  return res;
}

export const getTemplateList = async (data: { folder?: string, keyword?: string }) => {
  const res = await clientFetch({
    url: `/api/template/getList`,
    method: 'GET',
    data,
  })
  return res;
}

export const getFolderList = async () => {
  const res = await clientFetch({
    url: `/api/template/getFolderList`,
    method: 'GET',
  })
  return res;
}

export const getTemplate = async (id: number) => {
  const res = await clientFetch({
    url: `/api/template/get`,
    method: 'GET',
    data: { id },
    contentType: 'application/x-www-form-urlencoded',
  })
  return res;
}
export const delTemplate = async (id: number) => {
  const res = await clientFetch({
    url: `/api/template/remove/${id}`,
    method: 'DELETE',
    data: { id },
    contentType: 'application/x-www-form-urlencoded',
  })
  return res;
}
