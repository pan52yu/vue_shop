import axios from '@/utils/requst'

// 验证登陆
export const goLogin = info => {
  return axios({
    url: 'login',
    method: 'post',
    data: info
  })
}
