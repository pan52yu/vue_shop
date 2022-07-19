import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 引入全局修改样式
import '@/assets/css/global.css'
// 引入字体图标
import '@/assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'

Vue.component('ZkTable', ZkTable)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
