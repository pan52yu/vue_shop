import axios from 'axios'
import { getLocal } from '@/utils/storage'
import { USERKEYS } from '@/utils/local'
// 通过axios拦截器添加token验证
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = getLocal(USERKEYS)
  return config
})
axios.defaults.baseURL = 'http://liufusong.top:8899/api/private/v1/'
export default axios
