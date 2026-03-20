<template>
  <div class="profit-list">
    <PageHeader title="收益记录管理">
      <template #action>
        <el-button type="primary" @click="toForm()">
          <el-icon><Plus /></el-icon> 新增记录
        </el-button>
      </template>
    </PageHeader>

    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form" @submit.prevent="getList">
      <el-form-item label="产品ID">
        <el-input v-model="searchForm.productId" type="number" placeholder="请输入产品ID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="productId" label="产品ID" width="100"></el-table-column>
      <el-table-column prop="profitAmount" label="收益金额" width="120">
        <template #default="scope">
          {{ formatMoney(scope.row.profitAmount) }}
        </template>
      </el-table-column>
      <el-table-column prop="profitRate" label="收益率(%)" width="120">
        <template #default="scope">
          {{ scope.row.profitRate || 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="recordDate" label="记录日期" width="120"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" size="small" @click="toForm(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="getList"
      @current-change="getList"
      style="margin-top: 20px; text-align: right"
    >
    </el-pagination>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import { getProfitPage, deleteProfit } from '@/api/profit'
import { formatMoney } from '@/utils'

const router = useRouter()
const route = useRoute()

// 分页参数
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])

// 搜索表单
const searchForm = reactive({
  productId: route.query.productId || ''
})

// 获取列表数据
const getList = () => {
  getProfitPage({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    productId: searchForm.productId
  }).then(res => {
    tableData.value = res.records
    total.value = res.total
  })
}

// 重置搜索
const resetSearch = () => {
  searchForm.productId = ''
  getList()
}

// 跳转到表单页
const toForm = (id) => {
  router.push({ 
    name: 'ProfitForm', 
    params: { id },
    query: { productId: searchForm.productId }
  })
}

// 删除收益记录
const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该收益记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteProfit(id).then(() => {
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