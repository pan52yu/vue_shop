import requst from '@/utils/requst'

// 验证登陆
export const goLogin = info => {
  return requst({
    url: '/login',
    method: 'post',
    data: info
  })
}
