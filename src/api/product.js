import request from './index'

export function getProductPage(params) {
  return request({
    url: '/product/page',
    method: 'get',
    params
  })
}

export function addProduct(data) {
  return request({
    url: '/product',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/product',
    method: 'put',
    data
  })
}

export function deleteProduct(id) {
  return request({
    url: `/product/${id}`,
    method: 'delete'
  })
}

export function getProductById(id) {
  return request({
    url: `/product/${id}`,
    method: 'get'
  })
}

// 获取所有产品
export function getProductList() {
  return request({
    url: '/product/page',
    method: 'get',
    params: { pageNum: 1, pageSize: 999 }
  }).then(res => res.records)
}

// 新增：计算产品指标
export function calculateIndicators(productId) {
  return request({
    url: `/product/calculate-indicators/${productId}`,
    method: 'post'
  })
}