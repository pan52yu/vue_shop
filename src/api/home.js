import axios from '@/utils/requst'

export const getMenuList = () => {
  return axios({
    url: 'menus'
  })
}
