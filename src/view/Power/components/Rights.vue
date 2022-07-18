<template>
  <div>
    <!--  面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片导航  -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="pid">
          <template #default="{row :{pid}}">
            <el-tag v-if="pid === 0">等级一</el-tag>
            <el-tag type="success" v-else-if="pid === 1">等级二</el-tag>
            <el-tag type="warning" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getRightsList } from '@/api/power'

export default {
  name: 'Rights',
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data } = await getRightsList('tree')
      if (data.meta.status !== 200) return this.$message.error('获取列表失败！')
      this.rightsList = data.data
      console.log('rightsList', this.rightsList)
    }
  }
}
</script>
<style lang="less" scoped></style>
