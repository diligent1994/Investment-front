<template>
  <div class="product-comparison">
    <PageHeader title="理财产品收益对比">
      <template #action>
        <el-button @click="refreshData">刷新数据</el-button>
        <el-button type="primary" @click="toTrend">查看收益曲线</el-button>
      </template>
    </PageHeader>

    <ChartCard title="产品总收益对比" :option="chartOption"></ChartCard>

    <!-- 数据表格 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-top: 20px">
      <el-table-column prop="productId" label="产品ID" width="80"></el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="150"></el-table-column>
      <el-table-column prop="purchaseAmount" label="购买金额" width="120">
        <template #default="scope">
          {{ formatMoney(scope.row.purchaseAmount) }}
        </template>
      </el-table-column>
      <el-table-column prop="totalIncome" label="总收益" width="120">
        <template #default="scope">
          {{ formatMoney(scope.row.totalIncome) }}
        </template>
      </el-table-column>
      <el-table-column prop="incomeRate" label="总收益率(%)" width="120">
        <template #default="scope">
          {{ ((scope.row.totalIncome / scope.row.purchaseAmount) * 100).toFixed(2) || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="text" @click="selectProduct(scope.row.productId)">查看曲线</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <ChartCard title="产品多指标对比" :option="multiIndicatorOption"></ChartCard>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores'
import PageHeader from '@/components/PageHeader.vue'
import ChartCard from '@/components/ChartCard.vue'
import { getProductComparison } from '@/api/report'
import { formatMoney } from '@/utils'

const router = useRouter()
const mainStore = useMainStore()

// 图表配置
const chartOption = ref({
  title: {
    text: '产品总收益对比',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    name: '金额（元）'
  },
  series: [
    {
      name: '购买金额',
      type: 'bar',
      data: [],
      itemStyle: { color: '#409eff' }
    },
    {
      name: '总收益',
      type: 'bar',
      data: [],
      itemStyle: { color: '#67c23a' }
    }
  ]
})

// 表格数据
const tableData = ref([])

// 新增多指标对比图表配置
const multiIndicatorOption = ref({
  title: {
    text: '产品多指标对比',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  legend: {
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: [
    {
      type: 'value',
      name: '收益率/回撤/费率(%)',
      position: 'left'
    },
    {
      type: 'value',
      name: '夏普比率',
      position: 'right',
      axisLine: { lineStyle: { color: '#e6a23c' } },
      axisLabel: { color: '#e6a23c' }
    }
  ],
  series: [
    { name: '年化收益率(%)', type: 'bar', yAxisIndex: 0, data: [], itemStyle: { color: '#67c23a' } },
    { name: '最大回撤(%)', type: 'bar', yAxisIndex: 0, data: [], itemStyle: { color: '#f56c6c' } },
    { name: '费率(%)', type: 'bar', yAxisIndex: 0, data: [], itemStyle: { color: '#909399' } },
    { name: '夏普比率', type: 'line', yAxisIndex: 1, data: [], itemStyle: { color: '#e6a23c' }, smooth: true }
  ]
})

// 重构getComparisonData方法
const getComparisonData = () => {
  getProductComparison().then(res => {
    tableData.value = res
    chartOption.value.xAxis.data = res.map(item => item.productName)
    chartOption.value.series[0].data = res.map(item => Number(item.purchaseAmount))
    chartOption.value.series[1].data = res.map(item => Number(item.totalIncome))
    // 多指标图表数据
    multiIndicatorOption.value.xAxis.data = res.map(item => item.productName)
    multiIndicatorOption.value.series[0].data = res.map(item => Number(item.annualizedReturn))
    multiIndicatorOption.value.series[1].data = res.map(item => Number(item.maxDrawdown))
    multiIndicatorOption.value.series[2].data = res.map(item => Number(item.feeRate))
    multiIndicatorOption.value.series[3].data = res.map(item => Number(item.sharpeRatio))
  })
}

// 刷新数据
const refreshData = () => {
  getComparisonData()
}

// 选择产品查看曲线
const selectProduct = (productId) => {
  mainStore.setCurrentProductId(productId)
  router.push({ name: 'IncomeTrend', params: { productId } })
}

// 跳转到收益曲线页面
const toTrend = () => {
  if (tableData.value.length > 0) {
    const firstProductId = tableData.value[0].productId
    router.push({ name: 'IncomeTrend', params: { productId: firstProductId } })
  } else {
    ElMessage.warning('暂无产品数据')
  }
}

onMounted(() => {
  getComparisonData()
})
</script>