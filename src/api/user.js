import axios from 'axios'

// 获取用户列表
export const getUserList = (params) => {
  return axios({
    url: 'users',
    params: params
  })
}
// 改变状态
export const changUserStatus = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'PUT'
  })
}

// 添加用户
export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'POST',
    data: data
  })
}

// 查询需要修改的用户
export const editUser = (id, email, mobile) => {
  return axios({
    url: '/users/' + id,
    method: 'put',
    data: {
      email: email,
      mobile: mobile
    }
  })
}
// 删除用户信息
export const deleteUser = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'DELETE'
  })
}

// 获取角色列表
export const getRolesList = () => {
  return axios({
    url: 'roles'
  })
}

// 分配用户角色
export const assignUserRoles = (id, rid) => {
  return axios({
    url: `users/${id}/role`,
    method: 'PUT',
    data: {
      rid
    }
  })
}
