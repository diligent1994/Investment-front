import request from './index'

// 产品对比
export function getProductComparison() {
  return request({
    url: '/reports/product-comparison',
    method: 'get'
  })
}

// 收益曲线
export function getIncomeTrend(params) {
  return request({
    url: '/reports/income-trend',
    method: 'get',
    params
  })
}