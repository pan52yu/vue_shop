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
import '@/utils/filter'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor /* { default global options } */)
Vue.component('ZkTable', ZkTable)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
