<template>
  <div>
    <!--  面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片导航  -->
    <el-card>
      <!--   添加角色按钮区域   -->
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>
    </el-card>
    <!--  用户角色列表  -->
    <el-table :data="rolesList" border stripe>
      <!--   展开列   -->
      <el-table-column type="expand" label="#">
        <template #default="scope">
          <div style="padding: 20px 50px">
            <el-row :class="['bdbottom',{bdtop:indexOne === 0},'vcenter']"
                    v-for="(itemOne,indexOne) in scope.row.children"
                    :key="itemOne.id">
              <!--      渲染一级权限        -->
              <el-col :span="5">
                <el-tag closable @close="deleteRigth(scope.row,indexOne.id)">{{ itemOne.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--      渲染二级和三级权限        -->
              <el-col :span="19">
                <!--        通过for循环children 渲染二级        -->
                <el-row :class="[{bdtop:indexTwo!==0},'vcenter']" v-for="(itemTwo,indexTwo) in itemOne.children"
                        :key="indexTwo">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="deleteRigth(scope.row,itemTwo.id)">{{
                        itemTwo.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag @close="deleteRigth(scope.row,itemTwree.id)" closable type="warning"
                            v-for="itemTwree in itemTwo.children"
                            :key="itemTwree.id">
                      {{ itemTwree.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <!--          <pre>{{ scope.row }}</pre>-->
        </template>
      </el-table-column>
      <!--   索引列   -->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          <el-button @click="showSetRightDialog(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分配权限对话框  -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%" @close="setRightDialogClosed"
    >
      <!--   树形控件   -->
      <el-tree :data="rightsList" :props="defaultProps" show-checkbox node-key="id" default-expand-all
               :default-checked-keys="defKeys" ref="rigthRef"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRihgts">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { addRoleAuthorization, delRolesListById, getRightsList, getRolesList } from '@/api/power'

export default {
  name: 'Roles',
  data () {
    return {
      rolesList: [],
      setRightDialogVisible: false, // 控制分配权限对话框
      rightsList: [], // 所有权限的数据
      // 树形控件配置
      defaultProps: {
        // 通过label设置树形节点文本展示authName
        label: 'authName',
        // 设置通过children属性展示子节点信息
        children: 'children'
      },
      // 默认选中节点的ID值数组
      defKeys: [],
      // 待分配权限的角色ID
      roleId: null
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色权限列表
    async getRolesList () {
      const { data } = await getRolesList()
      if (data.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = data.data
      console.log('rolesList', data.data)
    },
    // 删除角色指定权限
    async deleteRigth (role, rightId) {
      const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') return this.$message.info('取消删除')
      console.log(role, rightId)
      console.log('点击了删除')

      // 用户点击了确定表示真的要删除
      // 当发送delete请求之后，返回的数据就是最新的角色权限信息
      const { data } = await delRolesListById(role, rightId)
      if (data.meta.status !== 200) {
        return this.$message.error('删除角色权限失败')
      }
      // 无需再重新加载所有权限
      // 只需要对现有的角色权限进行更新即可
      role.children = data.data
    },
    // 点击弹出编辑权限框
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data } = await getRightsList('tree')
      this.rightsList = data.data
      console.log('rightsList', this.rightsList)
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    //   通过递归的形式,获取角色下的所有三级权限的id 并保存 defKeys中
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归调用
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 分配权限对话框关闭时 ，清空默认选中节点的ID值数组
    setRightDialogClosed () {
      this.defKeys = []
    },
    //  为角色分配权限
    async allotRihgts () {
      const arr = [
        ...this.$refs.rigthRef.getCheckedKeys(),
        ...this.$refs.rigthRef.getHalfCheckedKeys()
      ]
      const { data } = await addRoleAuthorization(this.roleId, arr.join(','))
      if (data.meta.status !== 200) return this.$message.error('分配权限失败')

      await this.getRolesList()
      this.setRightDialogVisible = false
      this.$message.success('分配权限成功')
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px #eee solid;
}

.bdbottom {
  border-bottom: 1px #eee solid;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
