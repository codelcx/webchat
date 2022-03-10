import request from './request'

//朋友列表
export function getFriendList(curUserId) {
  return request({
    url: `/friendList`,
    params: {
      curUserId
    }
  })
}

//判断是否是朋友
export function getFriendById(uid, fid) {
  return request({
    url: '/friend',
    params:{
      uid,
      fid
    }
  })
}

//好友请求
export function makeFriend(uid, fid) {
  return request({
    url: '/makefriend',
    params:{
      uid,
      fid
    }
  })
}
//好友请求列表
export function getNewFriendList(uid) {
  return request({
    url: '/newfriend',
    params: {
      uid,
    }
  })
}