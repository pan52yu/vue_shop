# vue_shop

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 所有的请求都是带权限的

> 需要配置Authorization字段

```javascript
// 通过axios拦截器添加token验证
axios.interceptors.request.use(config => {
  config.headers.Authorization = getLocal(USERKEYS)
  return config
})
```

使用element组件时
el-upload可以配置 headers 属性 绑定对象

```vue 
 <el-upload action="http://liufusong.top:8899/api/private/v1/upload"
   :headers="headerObj"
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

### https://github.com/MisterTaki/vue-table-with-tree-grid

### 富文本编辑器

> Vue-Quill-Editor

### lodash

+ lodash 中文文档
  + https://www.lodashjs.com/docs/lodash.cloneDeep#_clonedeepvalue
+ `yarn add --save lodash`
+ lodash merge合并
