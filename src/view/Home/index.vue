<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="@/assets/heima.png" alt="">
        <span>杭州黑马后台管理系统</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--   侧边栏   -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--    侧边栏菜单区域    -->
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="red"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <!-----  一级菜单 ---->
          <el-submenu v-for="(item,index) in menuList" :key="item.id" :index="item.id + ''">
            <!----  一级菜单的模板区域  ---->
            <template slot="title">
              <!----  图标    ---->
              <i :class="iconList[index]"></i>
              <!----  文本    ---->
              <span>{{ item.authName }}</span>
            </template>
            <!----  二级菜单S  ---->
            <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/'+subItem.path">
              <!----  二级菜单的模板区域  ---->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
            <!----  二级菜单E  ---->
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <Welcome></Welcome>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeLocal } from '@/utils/storage'
import { USERKEYS } from '@/utils/local'
import { Message } from 'element-ui'
import { getMenuList } from '@/api/home'
import Welcome from '@/view/Home/components/welcome'

export default {
  name: 'Home',
  components: { Welcome },
  data () {
    return {
      menuList: [],
      iconList: [
        'iconfont icon-users',
        'iconfont icon-tijikongjian',
        'iconfont icon-shangpin',
        'iconfont icon-danju',
        'iconfont icon-baobiao'
      ],
      isCollapse: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    async getMenuList () {
      const { data } = await getMenuList()
      this.menuList = data.data
      console.log(data)
    },
    logout () {
      removeLocal(USERKEYS)
      this.$router.push({ path: '/login' })
      Message.success('退出成功')
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
      display: flex;
      align-items: center;
      color: #ffffff;
      font-size: 22px;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #313743;

    .iconfont {
      margin-right: 10px;
    }

    .el-menu {
      border-right: none;
    }

    .toggle-button {
      font-size: 10px;
      color: #ffffff;
      text-align: center;
      line-height: 24px;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
}
</style>
