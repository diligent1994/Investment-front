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

/**
 * 产品多指标趋势（收益+年化+最大回撤+夏普比率）
 */
export function getMultiIndicatorTrend(params) {
  return request({
    url: '/reports/multi-indicator-trend',
    method: 'get',
    params
  })
}