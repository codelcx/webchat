import request from './request'

//1.与用户相关的请求
//登录
export function login(username, password) {
  return request({
    url: '/login',
    params: {
      username,
      password
    }
  })
}
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

//推荐用户
export function getRecommendUser(data) {
  return request({
    url: '/recommendUser',
    method:'post',
    headers:{'Content-Type':'application/json;charset=utf-8'},
    data:JSON.stringify(data)
  })
}

//查用户
export function getUserById(id) {
  return request({
    url: '/userById',
    params:{
      id
    }
  })
}

//修改用户信息
export function userEdit(data) {
  return request({
    url: '/userEdit',
    method: 'post',
    headers:{'Content-Type':'application/json;charset=utf-8'},
    data:JSON.stringify(data)
  })
}


//分割线--------------------------------------------------------------------------

//2.与社区相关的请求
//获取所有文章
export function getAllArticle(id) {
  return request({
    url: '/allArticle',
    params:{
      id
    }
  })
}

//根据用户ID获取它发布的所有文章
export function getArticleById(curUserId) {
  return request({
    url: '/allArticleById',
    params: {
      id:Number(curUserId)
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


//点赞
export function thumbUp(data) {
  return request({
    url: '/thumbUp',
    params: {
      uid:data.uid,
      aid:data.aid,
      state:data.state
    }
  })

}
//获取文章的所有评论
export function comment(aid) {
  return request({
    url: '/comment',
    params: {
      aid:Number(aid)
    }
  })
}

//发表评论
export function senComment(data) {
  return request({
    url: '/senComment',
    method:'post',
    headers:{'Content-Type':'application/json;charset=utf-8'},
    data:JSON.stringify(data)
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


//分割线--------------------------------------------
//5.会员

//会员开通
export function memberOpen(id) {
  return request({
    url: '/memberOpen',
    method: 'post',
    params: {
      id,
    }
  })
}
//聊天背景装扮
export function chatBackground(id,style) {
  return request({
    url: '/chatBackground',
    method:'post',
    params: {
      id,
      style
    }
  })
}