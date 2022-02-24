import request from './request'
export function getFriendList(curUserId) {
  return request({
    url: `/friendList`,
    method: 'get',
    params: {
      curUserId
    }
  })
}