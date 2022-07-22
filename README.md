## 所有的请求都是带权限的

> 需要配置 Authorization 字段

```javascript
// 通过axios拦截器添加token验证
axios.interceptors.request.use((config) => {
  config.headers.Authorization = getLocal(USERKEYS);
  return config;
});
```

使用 element 组件时
el-upload 可以配置 headers 属性 绑定对象

```vue

<el-upload action="http://liufusong.top:8899/api/private/v1/upload" :headers="headerObj">
</el-upload>

// 图片上传的请求头对象
data () {
return:{
headerObj: {
Authorization: getLocal(USERKEYS)
}
}
}
```

## 第三方插件

### 树形表格组件

> https://github.com/MisterTaki/vue-table-with-tree-grid  <br />
+ 打开main.js，导入vue-table-with-tree-grid
```js
  import TreeTable from 'vue-table-with-tree-grid'
  //全局注册组件
  Vue.component('tree-table', TreeTable)
```
+ 使用组件展示分类数据
```js
<!-- 分类表格
:data(设置数据源) :columns(设置表格中列配置信息) :selection-type(是否有复选框)
:expand-type(是否展开数据) show-index(是否设置索引列) index-text(设置索引列头)
border(是否添加纵向边框) :show-row-hover(是否鼠标悬停高亮) -->
    
<tree-table :data="cateList" :columns="columns" :selection-type="false"
:expand-type="false" show-index index-text="#" border :show-row-hover="false">
</tree-table>
```

### 富文本编辑器

> Vue-Quill-Editor
> https://github.com/surmon-china/vue-quill-editor

### lodash

- lodash 中文文档
    - > https://www.lodashjs.com/docs/lodash.cloneDeep#_clonedeepvalue
- `yarn add --save lodash`
- lodash merge 合并

### 添加进度条

`nprogress`插件

> https://github.com/rstacruz/nprogress

```javascript
//导入进度条插件
import NProgress from "nprogress";
//导入进度条样式
import "nprogress/nprogress.css";

//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use((config) => {
  //当进入request拦截器，表示发送了请求，我们就开启进度条
  NProgress.start();
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token");
  //必须返回config
  return config;
});
//在response拦截器中，隐藏进度条
axios.interceptors.response.use((config) => {
  //当进入response拦截器，表示请求已经结束，我们就结束进度条
  NProgress.done();
  return config;
});
```
