<template>
  <div>
    <h3>商品分类</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      </el-row>
      <!-- 分类表格  -->
      <ZkTable
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :show-row-hover="false"
        border
        index-text="#"
        show-index
        :expand-type="false"
        :selection-type="false"
      >
        <!--    是否有效    -->
        <template #isOk="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: #008000"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--    排序    -->
        <template #order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
          >二级
          </el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!--    操作   -->
        <template #opt>
          <el-button type="primary" icon="el-icon-edit" size="mini"
          >编辑
          </el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
          >删除
          </el-button
          >
        </template>
      </ZkTable>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!--  添加分类对话框  -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      @close="addCateDialogClosed"
      width="50%">
      <!--   添加分类的表单   -->
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!--    级联选择框      -->
          <!--     options指定数据源     -->
          <!--     props指定数据对象     -->
          <el-cascader
            style="width: 100%;"
            clearable
            :options="parentCateList"
            v-model="selectedKeys"
            :props="cascaderProps"
            @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { addCategories, getCategoriesList, getCateList } from '@/api/categories'

export default {
  name: 'Cate',
  data () {
    return {
      //  商品分类列表
      cateList: [],
      //  商品分类查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //  总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template', // 指定当前页为模板页
          template: 'isOk' // 模板名称
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false, // 是否显示添加分类对话框
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '', // 分类名称
        cat_pid: 0, // 分类父 ID
        cat_level: 0 // 分类层级 默认为一级分类
      },
      addCateRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      parentCateList: [], // 父级分类的列表
      // 级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true, // 可以选择任意一级选项
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中项绑定值 cat_id
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data } = await getCateList(this.queryInfo)
      if (data.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      console.log('cateList', data.data)
      this.cateList = data.data.result
      this.total = data.data.total
    },
    // 监听 pageSize 的变化
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //   监听页码 pageNum 的变化
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加分类对话框
    showAddCateDialog () {
      this.getCategoriesList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类数据列表
    async getCategoriesList () {
      const { data } = await getCategoriesList()

      if (data.meta.status !== 200) {
        return this.$message.error('获取父级分类数据列表失败')
      }
      this.parentCateList = data.data
      console.log('CategoriesList', this.parentCateList)
    },
    // cascader 选择项发生变化触发
    parentCateChange () {
      console.log(this.selectedKeys)
      // selectedKeys 的 length 大于 0 则选择了父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的ID
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //   点击按钮添加新的分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data } = await addCategories(this.addCateForm)
        if (data.meta.status !== 201) return this.$message.error('添加分类失败!')
        this.$message.success('添加分类成功！')
        this.addCateDialogVisible = false
        this.getCateList()
      })
    },
    //  监听添加分类对话框的关闭事件
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.addCateDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
