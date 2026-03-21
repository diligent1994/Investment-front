<template>
  <div class="product-list">
    <PageHeader title="理财产品列表">
      <template #action>
        <el-button type="primary" @click="toForm()">
          <el-icon>
            <Plus />
          </el-icon> 新增产品
        </el-button>
      </template>
    </PageHeader>

    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form" @submit.prevent="getList">
      <el-form-item label="产品名称">
        <el-input v-model="searchForm.name" placeholder="请输入产品名称"></el-input>
      </el-form-item>
      <el-form-item label="产品类型">
        <el-input v-model="searchForm.type" placeholder="请输入产品类型"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="产品名称" min-width="150"></el-table-column>
      <el-table-column prop="type" label="产品类型" width="120"></el-table-column>
      <el-table-column prop="investAmount" label="购买金额" width="120">
        <template #default="scope">
          {{ formatMoney(scope.row.investAmount) }}
        </template>
      </el-table-column>
      <el-table-column prop="buyDate" label="购买日期" width="120"></el-table-column>
      <el-table-column prop="status" label="状态" width="100"></el-table-column>
      <el-table-column prop="annualizedReturn" label="年化收益率(%)" width="120">
        <template #default="scope">
          {{ scope.row.annualizedReturn || 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="maxDrawdown" label="最大回撤(%)" width="100">
        <template #default="scope">
          {{ scope.row.maxDrawdown || 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="sharpeRatio" label="夏普比率" width="100">
        <template #default="scope">
          {{ scope.row.sharpeRatio || 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="expectedYield" label="预期收益率(%)" width="120">
        <template #default="scope">
          {{ scope.row.expectedYield || 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="riskLevel" label="风险等级" width="100"></el-table-column>
      <el-table-column prop="feeRate" label="费率(%)" width="100">
        <template #default="scope">
          {{ scope.row.feeRate || 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="liquidity" label="流动性" width="100"></el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button type="primary" size="small" @click="toForm(scope.row.id)">编辑</el-button>
          <el-button type="warning" size="small" @click="calculate(scope.row.id)">计算指标</el-button>
          <el-button type="warning" size="small" @click="toProfit(scope.row.id)">收益记录</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
      :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="getList" @current-change="getList"
      style="margin-top: 20px; text-align: right">
    </el-pagination>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import { getProductPage, deleteProduct, calculateIndicators } from '@/api/product'
import { formatMoney } from '@/utils'

const router = useRouter()

// 分页参数
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])

// 搜索表单
const searchForm = reactive({
  name: '',
  type: ''
})

// 获取列表数据
const getList = () => {
  getProductPage({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    name: searchForm.name,
    type: searchForm.type
  }).then(res => {
    tableData.value = res.records
    total.value = res.total
  })
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.type = ''
  getList()
}

// 跳转到表单页
const toForm = (id) => {
  router.push({ name: 'ProductForm', params: { id } })
}

// 新增：计算产品指标
const calculate = async (productId) => {
  try {
    await calculateIndicators(productId)
    ElMessage.success('指标计算成功！')
    getList() // 刷新列表
  } catch (error) {
    ElMessage.error('计算指标失败：' + error.message)
  }
}

// 跳转到收益记录
const toProfit = (productId) => {
  router.push({ name: 'ProfitList', query: { productId } })
}

// 删除产品
const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该产品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteProduct(id).then(() => {
      ElMessage.success('删除成功')
      getList()
    })
  })
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.search-form {
  margin-bottom: 20px;
}
</style>