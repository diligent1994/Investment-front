<template>
  <div class="page-header">
    <div class="title">{{ title }}</div>
    <div class="action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}
.action {
  display: flex;
  gap: 8px;
}
</style>