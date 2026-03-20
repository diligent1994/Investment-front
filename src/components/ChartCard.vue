<template>
  <div class="chart-card">
    <div class="card-header">{{ title }}</div>
    <div class="card-body" ref="chartRef"></div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  option: {
    type: Object,
    required: true
  }
})

const chartRef = ref(null)
let chartInstance = null

// 初始化图表
const initChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(props.option)
}

// 监听窗口大小变化
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

watch(() => props.option, () => {
  initChart()
}, { deep: true })

// 组件卸载时销毁图表
onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  if (chartInstance) {
    chartInstance.dispose()
  }
})
</script>

<style scoped>
.chart-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  height: 400px;
  display: flex;
  flex-direction: column;
}
.card-header {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #333;
}
.card-body {
  flex: 1;
}
</style>