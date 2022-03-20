import request from './request'

//1.与用户相关的请求
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

//加好友请求
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

//删除好友
export function deleteFriend(uid, fid) {
  return request({
    url: '/deletefriend',
    params:{
      uid,
      fid
    }
  })
}

//是否同意好友申请
export function addFriend(uid, fid,flag) {
  return request({
    url: '/addfriend',
    params:{
      uid,
      fid,
      flag
    }
  })
}

//分割线--------------------------------------------------------------------------

//2.与社区相关的请求
//获取所有文章
export function getAllArticle() {
  return request({
    url:'/allArticle'
  })
}

//根据用户ID获取它发布的所有文章
export function getArticleById(curUserId) {
  return request({
    url: '/allArticleById',
    params: {
      id:curUserId
    }
  })
}

//发布文章，包括图片、文本
export function publishArticle(formData) {
  return request({
    url: '/publishArticle',
    method:'post',
    headers:{'Content-Type':'multipart/form-data'},
    data:formData
  })
}

//发布不包含图片文章
export function publishArticleText(formData) {
  return request({
    url: '/publishArticleText',
    method:'post',
    headers:{'Content-Type':'multipart/form-data'},
    data:formData
  })
}


//获取用户相册
export function getPhotoGraph(uid) {
  return request({
    url: '/photoGraph',
    params: {
      uid
    }
  })
}

//分割线-------------------------------------------------------------

//3.消息提醒
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


//分割线--------------------------------------------
//4.举报
export function complaint(data) {
  return request({
    url: '/complaint',
    method: 'post',
    headers:{'Content-Type':'application/json;charset=utf-8'},
    data:JSON.stringify(data)
  })
}