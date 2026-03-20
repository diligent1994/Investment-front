<template>
  <div class="income-trend">
    <PageHeader title="理财产品收益曲线">
      <template #action>
        <el-select v-model="selectedProductId" placeholder="请选择产品" style="width: 200px" @change="changeProduct">
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
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="getTrendData"
        ></el-date-picker>
        <el-button @click="refreshData">刷新数据</el-button>
      </template>
    </PageHeader>

    <ChartCard title="收益趋势曲线" :option="chartOption"></ChartCard>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import ChartCard from '@/components/ChartCard.vue'
import { getIncomeTrend } from '@/api/report'
import { getAllProducts } from '@/api/product'
import { formatDate } from '@/utils'

const route = useRoute()
const router = useRouter()

// 产品列表
const productList = ref([])
// 选中的产品ID
const selectedProductId = ref(route.params.productId || '')
// 日期范围
const dateRange = ref([])

// 图表配置
const chartOption = ref({
  title: {
    text: '收益趋势',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
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
    name: '收益金额（元）'
  },
  series: [
    {
      name: '收益金额',
      type: 'line',
      data: [],
      smooth: true,
      itemStyle: { color: '#67c23a' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(103, 194, 58, 0.6)'
          }, {
            offset: 1, color: 'rgba(103, 194, 58, 0.1)'
          }]
        }
      }
    }
  ]
})

// 获取产品列表
const getProductList = () => {
  getAllProducts().then(res => {
    productList.value = res
    if (res.length > 0 && !selectedProductId.value) {
      selectedProductId.value = res[0].id
      getTrendData()
    }
  })
}

// 获取收益趋势数据
const getTrendData = () => {
  if (!selectedProductId.value) {
    ElMessage.warning('请选择理财产品')
    return
  }

  const params = {
    productId: selectedProductId.value
  }

  // 添加日期范围筛选
  if (dateRange.value && dateRange.value.length === 2) {
    params.startDate = dateRange.value[0]
    params.endDate = dateRange.value[1]
  }

  getIncomeTrend(params).then(res => {
    // 更新图表数据
    chartOption.value.xAxis.data = res.map(item => formatDate(item.date))
    chartOption.value.series[0].data = res.map(item => Number(item.income))
  })
}

// 切换产品
const changeProduct = () => {
  router.push({ name: 'IncomeTrend', params: { productId: selectedProductId.value } })
  getTrendData()
}

// 刷新数据
const refreshData = () => {
  getTrendData()
}

// 监听路由参数变化
watch(() => route.params.productId, (newVal) => {
  selectedProductId.value = newVal
  getTrendData()
})

onMounted(() => {
  getProductList()
  if (selectedProductId.value) {
    getTrendData()
  }
})
</script>