import request from './request'

export function getAllArticle() {
  return request({
    url:'/allArticle'
  })
}

export function getArticleById(curUserId) {
  return request({
    url: '/allArticleById',
    params: {
      id:curUserId
    }
  })
}