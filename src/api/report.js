// 获取基于时间统计的折线图
import axios from 'axios'

export const getEcharts = () => {
  return axios({
    url: 'reports/type/1'
  })
}
