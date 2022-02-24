import axios from 'axios'
import qs from 'qs'
export const JSON = qs

//const AUTH_TOKEN = localStorage.getItem('token');
export default function request(config) {
  //axios.creat用于创建实例,分为全局配置与自定义配置，后者优先级高
  //baseURL,timeout,headers
  
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:1997',
    timeout: 10000
  })
  
  //添加请求拦截
  instance.interceptors.request.use(config => {
    //instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    //发送请求前做什么
    return config;
  },err => {
    console.log(err)
  })

  //添加响应拦截
  instance.interceptors.response.use(res => {
    //收到响应数据，对其做什么
    return res.data;
  },err => {
    console.log(err)
  })

  //返回自定义实例
  return instance (config)
}
