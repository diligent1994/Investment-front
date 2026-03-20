import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    // 存储当前选中的产品ID（用于报表联动）
    currentProductId: null
  }),
  actions: {
    setCurrentProductId(id) {
      this.currentProductId = id
    }
  }
})