<template>
  <div>
    <h3>订单列表</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--   订单列表数据   -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template #default="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger" effect="dark">未支付</el-tag>
            <el-tag effect="dark" v-else>已支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template #default="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button @click="showBox" size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button @click="showProgressBox" size="mini" type="danger" icon="el-icon-location"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--   分页   -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!--   修改地址对话框   -->
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%" @close="addressDialogClosed">
        <el-form :model="addressForm" :rules="addressRules" ref="addressRuleForm"
                 label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
              :props="cascaderProps"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
      </el-dialog>
      <!--   展示物流进度的对话框   -->
      <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%">
        <!--    时间线 TODO：接口没数据    -->
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp">
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
  </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { checkLogisticsInformation, getOrderList } from '@/api/order'
import cityData from '@/view/Order/citydata'

export default {
  name: 'Order',
  data () {
    return {
      // 查询条件
      queryInfo: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      total: 0,
      orderList: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressRules: {
        address1: [{
          required: true,
          message: '请选择省市区县',
          trigger: 'blur'
        }],
        address2: [{
          required: true,
          message: '请输入详细地址',
          trigger: 'blur'
        }]
      },
      cityData,
      cascaderProps: { expandTrigger: 'hover' },
      progressVisible: false,
      reverse: true,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data } = await getOrderList(this.queryInfo)
      if (data.meta.status !== 200) {
        return this.$message.error('获取订单数据列表失败')
      }
      this.orderList = data.data.goods
      this.total = data.data.total
      console.log('orderList', this.orderList)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址对话框
    showBox () {
      this.addressVisible = true
    },
    addressDialogClosed () {
      this.$refs.addressRuleForm.resetFields()
    },
    async showProgressBox () {
      this.progressVisible = true
      try {
        const { data } = await checkLogisticsInformation()
        console.log(data)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
