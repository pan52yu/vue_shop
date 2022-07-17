<template>
  <div>
    <!--  面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片  -->
    <el-card>
      <!--   添加与搜索   -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryIngo.query" clearable @clear="getUserList"
                    @keyup.enter.native="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addUserVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--   列表   -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template #default="scope">
            <!--     {{ scope.row.mg_state }}     -->
            <el-switch @change="changUserStatus(scope.row)" v-model="scope.row.mg_state">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <!--      编辑      -->
            <el-button @click="editUserInfo(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!--      删除      -->
            <el-button @click="deleteUser(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!--      分配角色      -->
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryIngo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryIngo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total">
      </el-pagination>
    </el-card>
    <!--  添加用户对话框  -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserVisible"
      width="50%"
      @close="dialogClose"
    >
      <!--   表单区域   -->
      <el-form :model="addForm" status-icon :rules="addFormRules"
               ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!--   底部区域   -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--  修改用户对话框  -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editUserVisible"
      width="50%"
      @close="resetFields"
    >
      <el-form :model="editForm" status-icon :rules="addFormRules"
               ref="editFormRef" label-width="70px">
        <el-form-item label="用户名称">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editUserVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUsersInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import { addUser, changUserStatus, deleteUser, editUser, getUserList } from '@/api/user'

export default {
  name: 'Users',
  data () {
    // 验证邮箱的规则
    const checkEmail = (rule, value, callback) => {
      const checkEmailRule = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (checkEmailRule.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    const checkMobile = (rule, value, callback) => {
      const checkMobileRule = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (checkMobileRule.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      queryIngo: {
        query: '',
        pagenum: 1, // 页码
        pagesize: 2 // 每页显示多少数据
      },
      userList: [],
      total: 0,
      addUserVisible: false, // 控制是否显示添加用户对话框
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      editUserVisible: false, // 控制是否显示修改用户对话框
      editForm: {} // 查询到的用户信息
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 删除用户
    async deleteUser (id) {
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //  点击确认返回 confirm
      if (res !== 'confirm') return this.$message.info('已取消删除')
      const { data } = await deleteUser(id)
      console.log(data)
      if (data.meta.status !== 200) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 修改用户信息并提交
    editUsersInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 表单验证不通过直接退出
        //  发请求
        const { data } = await editUser(this.editForm.id, this.editForm.email, this.editForm.mobile)
        if (data.meta.status !== 200) return this.$message.error('修改信息失败!')
        this.editUserVisible = false
        await this.getUserList()
        this.$message.success('修改信息成功！')
      })
    },
    // 重置修改用户对话框
    resetFields () {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑查询用户信息
    async editUserInfo (id) {
      const { data } = await editUser(id)
      console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = data.data
      this.editUserVisible = true
    },
    // 添加用户对话框点击确认时，进行表单验证并发送请求添加用户
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) { // 验证失败直接return
          return
        }
        // 验证成功发请求
        const { data } = await addUser(this.addForm)
        data.meta.status !== 201
          ? this.$message.error('添加用户失败')
          : this.$message.success('添加用户成功')
        this.addUserVisible = false
        await this.getUserList()
      })
    },
    // 用户对话框关闭时触发的事件
    dialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 更改用户状态
    async changUserStatus (userInfo) {
      console.log(userInfo)
      const { data } = await changUserStatus(userInfo.id, userInfo.mg_state)
      console.log(data)
      if (data.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更改用户状态失败')
      }
      this.$message.success('更改用户状态成功')
    },

    /**
     * 点击四个每页显示个数时触发的
     * @param {Number} newSize 点击每页显示多少数据
     * */
    handleSizeChange (newSize) {
      this.queryIngo.pagesize = newSize
      this.getUserList()
    },

    /**
     * 当前页改变时会触发
     * @param {Number} current 当前页码
     * */
    handleCurrentChange (current) {
      this.queryIngo.pagenum = current
      this.getUserList()
    },
    async getUserList () {
      const { data } = await getUserList(this.queryIngo)
      this.userList = data.data.users
      this.total = data.data.total
      // console.log(data)
    }
  }
}
</script>
<style lang="less" scoped></style>
