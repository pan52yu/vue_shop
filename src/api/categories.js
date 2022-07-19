import axios from 'axios'

// 获取商品分类列表
export const getCateList = (queryInfo) => {
  return axios({
    url: 'categories',
    params: queryInfo
  })
}

// 获取父级分类数据列表
export const getCategoriesList = () => {
  return axios({
    url: 'categories',
    params: {
      type: 2
    }
  })
}

// 添加分类
export const addCategories = (data) => {
  return axios({
    url: 'categories',
    method: 'POST',
    data
  })
}
