import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/product/list'
  },
  {
    path: '/product',
    name: 'Product',
    meta: { title: '理财产品管理' },
    children: [
      { path: 'list', name: 'ProductList', component: () => import('@/views/product/ProductList.vue') },
      { path: 'form/:id?', name: 'ProductForm', component: () => import('@/views/product/ProductForm.vue') }
    ]
  },
  {
    path: '/profit',
    name: 'Profit',
    meta: { title: '收益记录管理' },
    children: [
      { path: 'list', name: 'ProfitList', component: () => import('@/views/profit/ProfitList.vue') },
      { path: 'form/:id?', name: 'ProfitForm', component: () => import('@/views/profit/ProfitForm.vue') }
    ]
  },
  {
    path: '/report',
    name: 'Report',
    meta: { title: '报表分析' },
    children: [
      { path: 'comparison', name: 'ProductComparison', component: () => import('@/views/report/ProductComparison.vue') },
      { path: 'trend/:productId?', name: 'IncomeTrend', component: () => import('@/views/report/IncomeTrend.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - 个人理财系统'
  }
  next()
})

export default router