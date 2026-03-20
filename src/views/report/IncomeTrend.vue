<template>
  <div class="income-trend-container" ref="containerRef" style="width: 100%; height: 100%;">
    <div class="filter-bar" style="margin-bottom: 20px;">
      <el-select
        v-model="selectedProductId"
        placeholder="请选择产品"
        style="width: 200px;"
        @change="handleProductChange"
      >
        <el-option
          v-for="product in productList"
          :key="product.id"
          :label="product.name"
          :value="product.id"
        ></el-option>
      </el-select>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="margin-left: 10px;"
        @change="handleDateChange"
      ></el-date-picker>
    </div>

    <el-tabs v-model="activeTab" type="card" style="margin-bottom: 20px;" v-if="containerRef">
      <el-tab-pane label="收益趋势" name="income"></el-tab-pane>
      <el-tab-pane label="多指标趋势" name="multi"></el-tab-pane>
    </el-tabs>

    <div v-if="selectedProductId && containerRef" style="height: 400px;">
      <ChartCard
        v-if="activeTab === 'income'"
        title="收益趋势曲线"
        :option="chartOption"
        :height="400"
      ></ChartCard>
      <ChartCard
        v-if="activeTab === 'multi'"
        title="多指标趋势曲线"
        :option="multiIndicatorOption"
        :height="400"
      ></ChartCard>
    </div>
    <div v-else style="text-align: center; padding: 100px; color: #999;">
      请选择产品后查看趋势数据
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import ChartCard from '@/components/ChartCard.vue'
import { getIncomeTrend, getMultiIndicatorTrend } from '@/api/report'
import { getProductList } from '@/api/product'

const containerRef = ref(null)
const selectedProductId = ref('')
const activeTab = ref('income')
const dateRange = ref([])
const productList = ref([])

// 初始化图表配置（增加线条样式，确保可见）
const chartOption = ref({
  title: { text: '收益趋势曲线', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, data: ['收益金额'] },
  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
  xAxis: { 
    type: 'category', 
    data: [],
    axisLabel: { rotate: 30 } // 日期旋转，避免重叠
  },
  yAxis: { type: 'value', name: '收益金额(元)' },
  series: [{ 
    name: '收益金额', 
    type: 'line', 
    data: [], 
    smooth: true,
    showSymbol: true, // 显示数据点
    lineStyle: { width: 2, color: '#409EFF' }, // 线条宽度+颜色，确保可见
    itemStyle: { color: '#409EFF' }, // 数据点颜色
    emphasis: { itemStyle: { size: 8 } } // 鼠标悬浮放大数据点
  }]
})

const multiIndicatorOption = ref({
  title: { text: '多指标趋势曲线', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, data: ['年化收益率(%)', '最大回撤(%)', '夏普比率'] },
  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
  xAxis: { 
    type: 'category', 
    data: [],
    axisLabel: { rotate: 30 }
  },
  yAxis: [
    { type: 'value', name: '收益率/回撤(%)', position: 'left' },
    { type: 'value', name: '夏普比率', position: 'right', axisLine: { lineStyle: { color: '#e6a23c' } } }
  ],
  series: [
    { 
      name: '年化收益率(%)', 
      type: 'line', 
      yAxisIndex: 0, 
      data: [], 
      smooth: true,
      showSymbol: true,
      lineStyle: { width: 2, color: '#67c23a' },
      itemStyle: { color: '#67c23a' }
    },
    { 
      name: '最大回撤(%)', 
      type: 'line', 
      yAxisIndex: 0, 
      data: [], 
      smooth: true,
      showSymbol: true,
      lineStyle: { width: 2, color: '#f56c6c' },
      itemStyle: { color: '#f56c6c' }
    },
    { 
      name: '夏普比率', 
      type: 'line', 
      yAxisIndex: 1, 
      data: [], 
      smooth: true,
      showSymbol: true,
      lineStyle: { width: 2, color: '#e6a23c' },
      itemStyle: { color: '#e6a23c' }
    }
  ]
})

// 修复：接口返回的date是字符串，无需格式化（直接使用）
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  // 兼容接口返回的字符串日期和Date对象
  if (typeof dateStr === 'string') {
    return dateStr
  }
  const year = dateStr.getFullYear()
  const month = String(dateStr.getMonth() + 1).padStart(2, '0')
  const day = String(dateStr.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 加载产品列表
const loadProductList = async () => {
  try {
    const res = await getProductList()
    productList.value = res.data || res // 兼容不同的返回格式（res.data 或直接res）
    if (productList.value.length > 0) {
      selectedProductId.value = productList.value[0].id
    }
  } catch (error) {
    ElMessage.error('加载产品列表失败：' + (error.message || '未知错误'))
    console.error('产品列表加载失败：', error)
  }
}

// 加载趋势数据（核心修复：正确赋值数据）
const loadTrendData = async () => {
  if (!selectedProductId.value || !containerRef.value) return

  try {
    const params = { productId: selectedProductId.value }
    if (dateRange.value && dateRange.value.length === 2) {
      params.startDate = formatDate(dateRange.value[0])
      params.endDate = formatDate(dateRange.value[1])
    }

    // 1. 加载收益趋势（修复：直接使用res，而非res.data，根据实际返回格式调整）
    const incomeRes = await getIncomeTrend(params)
    const incomeData = incomeRes.data || incomeRes // 兼容接口返回格式
    console.log('收益趋势数据：', incomeData) // 调试日志，确认数据
    if (Array.isArray(incomeData)) {
      chartOption.value.xAxis.data = incomeData.map(item => item.date) // 直接用字符串日期
      chartOption.value.series[0].data = incomeData.map(item => Number(item.income) || 0)
    }

    // 2. 加载多指标趋势
    const multiRes = await getMultiIndicatorTrend(params)
    const multiData = multiRes.data || multiRes
    console.log('多指标趋势数据：', multiData) // 调试日志
    if (Array.isArray(multiData)) {
      multiIndicatorOption.value.xAxis.data = multiData.map(item => item.date)
      multiIndicatorOption.value.series[0].data = multiData.map(item => Number(item.annualizedReturn) || 0)
      multiIndicatorOption.value.series[1].data = multiData.map(item => Number(item.maxDrawdown) || 0)
      multiIndicatorOption.value.series[2].data = multiData.map(item => Number(item.sharpeRatio) || 0)
    }
  } catch (error) {
    ElMessage.error('加载趋势数据失败：' + (error.message || '未知错误'))
    console.error('趋势数据加载失败：', error)
  }
}

const handleProductChange = () => {
  loadTrendData()
}

const handleDateChange = () => {
  loadTrendData()
}

// 监听标签页切换
watch(activeTab, () => {
  if (selectedProductId.value) {
    loadTrendData()
  }
}, { immediate: true })

// 监听产品ID变化，强制更新图表
watch(selectedProductId, () => {
  loadTrendData()
}, { immediate: true })

onMounted(async () => {
  await loadProductList()
})

onUnmounted(() => {
  selectedProductId.value = ''
  dateRange.value = []
  chartOption.value.xAxis.data = []
  chartOption.value.series[0].data = []
  multiIndicatorOption.value.xAxis.data = []
  multiIndicatorOption.value.series.forEach(series => {
    series.data = []
  })
})
</script>

<style scoped>
.income-trend-container {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
}
.filter-bar {
  display: flex;
  align-items: center;
}
</style>