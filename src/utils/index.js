/**
 * 格式化日期
 * @param {Date|String} date 日期
 * @param {String} format 格式（默认YYYY-MM-DD）
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return format.replace('YYYY', year).replace('MM', month).replace('DD', day)
}

/**
 * 格式化金额
 * @param {Number|String} amount 金额
 */
export function formatMoney(amount) {
  if (!amount) return '0.00'
  return Number(amount).toFixed(2)
}