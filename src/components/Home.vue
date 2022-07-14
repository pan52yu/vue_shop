<template>
  <div class="Home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
import { removeLocal } from '@/utils/storage'
import { USERKEYS } from '@/utils/local'
import { Message } from 'element-ui'

export default {
  name: 'Home',
  methods: {
    logout () {
      removeLocal(USERKEYS)
      this.$router.push({ path: '/login' })
      Message.success('退出成功')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
