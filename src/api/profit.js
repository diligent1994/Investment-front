import request from './index'

// 分页查询收益记录
export function getProfitPage(params) {
  return request({
    url: '/profit/page',
    method: 'get',
    params
  })
}

// 获取收益记录详情
export function getProfitById(id) {
  return request({
    url: `/profit/${id}`,
    method: 'get'
  })
}

// 新增收益记录
export function addProfit(data) {
  return request({
    url: '/profit',
    method: 'post',
    data
  })
}

// 更新收益记录
export function updateProfit(data) {
  return request({
    url: '/profit',
    method: 'put',
    data
  })
}

// 删除收益记录
export function deleteProfit(id) {
  return request({
    url: `/profit/${id}`,
    method: 'delete'
  })
}