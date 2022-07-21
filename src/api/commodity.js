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

// 获取所有的商品分类列表
export const getAllCateList = () => {
  return axios({
    url: 'categories'
  })
}

// 根据所选分类的ID 和 当前的面板 获取对应的参数列表
export const getParamList = (id, sel) => {
  return axios({
    url: `categories/${id}/attributes`,
    params: {
      sel
    }
  })
}

// 添加动态参数或者静态属性
export const addParams = (id, data) => {
  return axios({
    url: `categories/${id}/attributes`,
    method: 'POST',
    data
  })
}

// 根据 ID 查询参数
export const paramsById = (id, attrId, attrSel) => {
  return axios({
    url: `categories/${id}/attributes/${attrId}`,
    params: {
      attr_sel: attrSel
    }
  })
}

// 编辑提交参数
export const submitParameters = (id, attrID, attrName, attrSel, attrVals) => {
  return axios({
    url: `categories/${id}/attributes/${attrID}`,
    method: 'PUT',
    data: {
      attr_name: attrName,
      attr_sel: attrSel,
      attr_vals: attrVals
    }
  })
}
// 删除参数
export const delParams = (id, attrId) => {
  return axios({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'DELETE'
  })
}

// 获取 商品列表数据
export const getGoodsList = (queryInfo) => {
  return axios({
    url: 'goods',
    method: 'GET',
    params: queryInfo
  })
}

// 根据 ID删除商品
export const deleteGoodsById = (id) => {
  return axios({
    url: `goods/${id}`,
    method: 'DELETE'
  })
}

// 获取动态参数列表 商品参数
export const getarticlelist = (id) => {
  return axios({
    url: `categories/${id}/attributes`,
    method: 'GET',
    params: {
      sel: 'many'
    }
  })
}

// 获取静态参数列表 商品属性
export const getStaticParameters = (id) => {
  return axios({
    url: `categories/${id}/attributes`,
    method: 'GET',
    params: {
      sel: 'only'
    }
  })
}

// 添加商品
export const addGoods = (addForm) => {
  return axios({
    url: 'goods',
    method: 'POST',
    data: addForm
  })
}
