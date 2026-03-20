<template>
  <div class="chart-card">
    <div class="card-header">{{ title }}</div>
    <div class="card-body" ref="chartRef" :style="{ width: '100%', height: height + 'px' }"></div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  option: { type: Object, required: true },
  height: { type: Number, default: 400 }
})

const chartRef = ref(null)
let chartInstance = null

// 初始化图表（确保DOM挂载）
const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(props.option)
}

// 监听option变化，更新图表
watch(() => props.option, (newOption) => {
  if (chartInstance) {
    chartInstance.setOption(newOption)
  }
}, { deep: true })

// 窗口大小变化时重绘
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

// 组件卸载时销毁图表
onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  if (chartInstance) {
    chartInstance.dispose() // 销毁图表，避免内存泄漏
    chartInstance = null
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