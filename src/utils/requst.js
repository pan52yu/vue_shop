import axios from 'axios'
import { getLocal } from '@/utils/storage'
import { USERKEYS } from '@/utils/local'
// 导入进度条插件
import NProgress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'
// 通过axios拦截器添加token验证
axios.interceptors.request.use(config => {
  // 当进入request拦截器，表示发送了请求，我们就开启进度条
  NProgress.start()
  config.headers.Authorization = getLocal(USERKEYS)
  return config
})
axios.interceptors.response.use(config => {
  // 当进入response拦截器，表示请求已经结束，我们就结束进度条
  NProgress.done()
  return config
})
axios.defaults.baseURL = 'http://liufusong.top:8899/api/private/v1/'
export default axios
