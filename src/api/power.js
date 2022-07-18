import axios from 'axios'

// 获取所有权限列表
export const getRightsList = (type) => {
  return axios({
    url: 'rights/' + type
  })
}

// 获取角色权限列表
export const getRolesList = () => {
  return axios({
    url: 'roles'
  })
}

// 删除角色指定权限
export const delRolesListById = (role, rightId) => {
  return axios({
    url: `roles/${role.id}/rights/${rightId}`,
    method: 'DELETE'
  })
}

// 添加角色授权
export const addRoleAuthorization = (role, rids) => {
  return axios({
    url: `roles/${role}/rights`,
    method: 'POST',
    data: {
      rids
    }
  })
}
