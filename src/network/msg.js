import request from './request'

//未读消息
export function unReadCount(uid) {
  return request({
    url: '/unreadcount',
    params: {
      uid
    }
  })
}

//清空好友申请未读数
export function clearApply(uid) {
  return request({
    url: '/clearapply',
    params: {
      uid
    }
  })
}