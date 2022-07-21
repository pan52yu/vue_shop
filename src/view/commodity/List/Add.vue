<template>
  <div class="Add">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图  -->
    <el-card>
      <!--   提示区域   -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!--   步骤条   -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本属性"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <!--   TODO:一定是el-from 里面嵌套el-tabs   -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormForm" label-width="100px"
               label-position="top">
        <el-tabs v-model="activeIndex" tab-position="left"
                 :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--     渲染表单的item项       -->
            <el-form-item :key="item.attr_id" :label="item.attr_name" v-for="item in manyTableData">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(cb,i) in item.attr_vals" :key="i"
                             :label="cb"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :key="item.attr_id" :label="item.attr_name"
                          v-for="item in onlyTableData">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://liufusong.top:8899/api/private/v1/upload"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--     富文本编辑器       -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <!--     添加商品按钮       -->
            <el-button @click="add" style="margin-top: 15px" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!--   预览图片对话框   -->
      <el-dialog
        title="图片预览"
        :visible.sync="previewDialogVisible"
        width="50%">
        <img :src="previewPath" alt="">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { addGoods, getarticlelist, getCateList, getStaticParameters } from '@/api/commodity'
import { getLocal } from '@/utils/storage'
import { USERKEYS } from '@/utils/local'
import { cloneDeep } from 'lodash/lang'

export default {
  name: 'Add',
  data () {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        pics: [],
        //  商品详情介绍
        goods_introduce: '',
        // 商品的参数（数组），包含 动态参数 和 静态属性
        attrs: []
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }
        ]
      },
      // 用来保存分类数据
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      //  静态属性列表数据
      onlyTableData: [],
      // 图片上传的请求头对象
      headerObj: {
        Authorization: getLocal(USERKEYS)
      },
      // 图片预览
      previewPath: '',
      previewDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList () {
      const { data } = await getCateList()
      if (data.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      console.log('cateList', data.data)
      this.cateList = data.data
    },
    handleChange () {
      console.log(this.addForm.goods_cat)

      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品的分类')
        return false
      }
    },
    async tabClicked () {
      console.log(this.activeIndex)
      // 获取动态参数 商品参数
      if (this.activeIndex === '1') {
        const { data } = await getarticlelist(this.cateId)
        if (data.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        data.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0
            ? []
            : item.attr_vals.split(' ')
        })
        this.manyTableData = data.data
        console.log('manyTableData', this.manyTableData)
      }
      // 获取静态参数列表  商品属性
      if (this.activeIndex === '2') {
        const { data } = await getStaticParameters(this.cateId)
        if (data.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        this.onlyTableData = data.data
        console.log('onlyTableData', this.onlyTableData)
      }
    },

    // 处理图片预览操作
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 处理移除图片预览操作
    handleRemove (file) {
      const filePath = file.response.data.tem_path

      const index = this.addForm.pics.findIndex(item => {
        return item.pic === filePath
      })
      this.addForm.pics.splice(index, 1)
      console.log('pics', this.addForm.pics)
    },
    // 上传成功触发
    handleSuccess (response) {
      console.log(response)
      const picInfo = {
        pics: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
      console.log('pics', this.addForm.pics)
    },
    //  添加商品
    async add () {
      try {
        await this.$refs.addFormForm.validate()
        const copyForm = cloneDeep(this.addForm)
        copyForm.goods_cat = copyForm.goods_cat.join(',')
        // 处理动态参数 和 静态属性
        this.manyTableData.forEach(item => {
          copyForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          })
        })
        this.onlyTableData.forEach(item => {
          copyForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
        console.log(copyForm)
        const { data } = await addGoods(copyForm)
        if (data.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        // 编程式导航跳转到商品列表
        await this.$router.push('/goods')
      } catch (e) {
        return this.$message.error('请输入必要的表单项')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>
