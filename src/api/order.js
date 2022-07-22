// 获取订单数据列表
import axios from 'axios'

export const getOrderList = (queryInfo) => {
  return axios({
    url: 'orders',
    method: 'get',
    params: queryInfo
  })
}

// 查看物流信息
export const checkLogisticsInformation = () => {
  return axios({
    url: '/kuaidi/1106975712662',
    method: 'get'
  })
}
