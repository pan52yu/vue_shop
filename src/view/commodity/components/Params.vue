<template>
  <div>
    <h3>分类参数</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!--   头部警告   -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!--   选择商品分类   -->
      <el-row style="margin: 15px 0">
        <span> 选择商品分类: </span>
        <!--    级联选择框    -->
        <el-cascader
          v-model="selectedCateKeys"
          :options="cateList"
          :props="cateProps"
          @change="handleChange"
        ></el-cascader>
      </el-row>
      <!--   tabs标签页   -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--    添加动态参数的面板    -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="addDialogVisible = true"
            size="mini"
            type="primary"
            :disabled="!(selectedCateKeys.length === 3)"
          >添加参数
          </el-button>
          <!--     动态参数表格     -->
          <el-table :data="manyTableData" border stripe>
            <!--      展开行      -->
            <el-table-column type="expand">
              <template #default="scope">
                <!--        循环渲染tag标签        -->
                <el-tag
                  v-for="(tag, index) in scope.row.attr_vals"
                  :key="index"
                  closable @close="handleClose(index,scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small"
                           @click="showInput(scope.row)">+ New Tag
                </el-button
                >
              </template>
            </el-table-column>
            <!--      索引列      -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                >编辑
                </el-button>
                <el-button
                  @click="delParams(scope.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                >删除
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--    添加静态属性的面板    -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            @click="addDialogVisible = true"
            size="mini"
            type="primary"
            :disabled="!(selectedCateKeys.length === 3)"
          >添加属性
          </el-button>
          <!--     静态属性表格     -->
          <el-table :data="onlyTableData" border stripe>
            <!--      展开列      -->
            <el-table-column type="expand">
              <template #default="scope">
                <!--        循环渲染tag标签        -->
                <el-tag
                  v-for="(tag, index) in scope.row.attr_vals"
                  :key="index"
                  closable @close="handleClose(index,scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small"
                           @click="showInput(scope.row)">+ New Tag
                </el-button
                >
              </template>
            </el-table-column>
            <!--      索引列      -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="分类名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                >
                  编辑
                </el-button>
                <el-button
                  @click="delParams(scope.row.attr_id)"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数或属性对话框 -->
    <el-dialog
      @close="addDialogClosed"
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <!-- 添加表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数或属性对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 添加表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addParams,
  delParams,
  getAllCateList,
  getParamList,
  paramsById,
  submitParameters
} from '@/api/commodity'

export default {
  data () {
    return {
      cateList: [],
      // 级联配置
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框的双向绑定数组
      selectedCateKeys: [],
      activeName: 'many',
      // 动态表格列表
      manyTableData: [],
      //   静态表格列表
      onlyTableData: [],
      // 控制添加参数属性对话框的显示或隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加表单验证规则
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改参数.属性对话框的显示或隐藏
      editDialogVisible: false,
      // 修改参数.属性对话框中的表单
      editForm: {
        attr_name: ''
      },
      // 修改表单的验证规则
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    // 分类ID
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[this.selectedCateKeys.length - 1]
      }
      return null
    },
    // 参数或属性对话框标题
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  created () {
    this.getAllCateList()
  },
  methods: {
    /**
     * 获取所有的商品分类列表
     * */
    async getAllCateList () {
      const { data } = await getAllCateList()
      if (data.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = data.data
      console.log('cateList->', this.cateList)
    },
    /**
     * 级联选择框变化会触发
     * */
    handleChange () {
      this.getParamData()
    },
    /**
     * tab页签点击时处理函数
     * */
    handleTabClick () {
      this.getParamData()
      console.log(this.activeName)
    },
    /**
     * 获取参数的列表数据 点击级联选择框和tab页签变化时都要调用
     * */
    async getParamData () {
      // 如果选中的不是三级 直接退出 并清空数组
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.onlyTableData = []
        this.manyTableData = []
        return
      }

      // 根据所选分类的ID 和 当前的面板 获取对应的参数
      const { data } = await getParamList(this.cateId, this.activeName)
      if (data.meta.status !== 200) {
        return this.$message.error('获取列表失败！')
      }
      data.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 添加一个bool值控制文本框的显示或者隐藏
        item.inputVisible = false
        // 添加一个inputValue保存文本框值
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = data.data
        console.log('manyTableData', this.manyTableData)
      } else {
        this.onlyTableData = data.data
        console.log('onlyTableData', this.onlyTableData)
      }
      console.log('selectedCateKeys->', this.selectedCateKeys)
    },
    // 关闭添加参数或属性对话框时清空表单
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加动态参数或者静态属性
    addParams () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data } = await addParams(this.cateId, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (data.meta.status !== 201) {
          return this.$message.error('添加属性失败！')
        }
        this.$message.success('添加属性成功！')
        this.addDialogVisible = false
        await this.getParamData()
        console.log(data.data)
      })
    },
    // 点击编辑按钮触发
    async showEditDialog (id) {
      const { data } = await paramsById(this.cateId, id, this.activeName)
      if (data.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }
      this.editForm = data.data
      console.log('editForm', this.editForm)
      this.editDialogVisible = true
    },
    // 当关闭修改参数.属性对话框时
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击修改参数对话框中的确认按钮触发
    editParams () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data } = await submitParameters(
          this.cateId,
          this.editForm.attr_id,
          this.editForm.attr_name,
          this.activeName,
          null
        )
        if (data.meta.status !== 200) {
          return this.$message.error('提交编辑失败！')
        }
        this.$message.success('提交编辑成功！')
        this.getParamData()
        this.editDialogVisible = false
      })
    },
    //  删除参数
    async delParams (attrID) {
      const res = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (res !== 'confirm') {
        return this.$message.info('点击了取消')
      }

      const { data } = await delParams(this.cateId, attrID)
      if (data.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }
      this.$message.success('删除参数成功！')
      await this.getParamData()
    },
    // 点击按钮，展示文本框
    showInput (row) {
      row.inputVisible = true
      // $nextTick:在页面上元素被重新渲染之后，调用回调函数的代码
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本框失去焦点或者按下enter触发事件
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求保存操作
      this.saveAttrVals(row)
    },
    //   删除对应的所选项
    handleClose (index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    // 对attr_vals的操作 发请求 保存到数据库
    async saveAttrVals (row) {
      // 发起请求保存操作
      const { data } = await submitParameters(this.cateId, row.attr_id,
        row.attr_name, row.attr_sel, row.attr_vals.join(' ')
      )
      if (data.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
}
</style>
