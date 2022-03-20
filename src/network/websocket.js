import request from './request'

export function createSession(friend, curUserId) {
  return request({
    url: '/createSession',
    method: 'get',
    params: {
      fromUserId: curUserId,
      toUserId: friend.id,
      toUserName: friend.username,
    }
  })
}

export function getSessionAlready(curUserId) {
  return request({
    url: '/getSessionAlready',
    method: 'get',
    params: {
     curUserId
   }
  })
}

export function getMsgList(sessionId) {
  return request({
    url: '/getMsgList',
    method: 'get',
    params: {
      sessionId
    }
  })
}