import clientFetch from '@/helper/clientFetch';
import { getLocalUser } from '@/util/storage';

export const addGroup = async (groupName: string) => {
  const localUser = getLocalUser()
  const { id = 0 } = localUser || {}
  const res = await clientFetch({
    url: `/api/group/add`,
    method: 'POST',
    data: {
      groupName,
      id,
      userId: 0,
    }
  })
  return res;
}

export const getGroupList = async () => {
  const res = await clientFetch({
    url: `/api/group/getList`,
    method: 'GET',
  })
  return res;
}

export const getGroupsAndContactCount = async () => {
  const res = await clientFetch({
    url: `/api/group/getGroupsAndContactCount`,
    method: 'GET',
  })
  return res;
}
export const getSubscriptionCount = async () => {
  const res = await clientFetch({
    url: `/api/subscription/getSubscriptionCount`,
    method: 'GET',
  })
  return res;
}



export const removeGroup = async (groupId: number) => {
  const res = await clientFetch({
    url: `/api/group/remove/${groupId}`,
    method: 'DELETE',
    contentType: 'application/x-www-form-urlencoded',
    data: { groupId }
  })
  return res;
}

export const updateGroup = async (groupName: string, groupId: number) => {
  const localUser = getLocalUser()
  const { id = 0 } = localUser || {}
  const res = await clientFetch({
    url: `/api/group/update`,
    method: 'POST',
    data: {
      groupName,
      id: groupId,
      userId: id,
    }
  })
  return res;
}