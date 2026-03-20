import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建Axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可添加token等请求头
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 后端统一返回格式：{code, msg, data}
    // 这里根据之前控制器返回的是 Result 包装，但 Result 中未定义 code，实际需要后端统一
    // 为简化，假设返回格式为 { success, message, data } 或直接数据
    // 根据 ProductController 代码，返回的是 Result<T>，其结构可能是 { code, msg, data } 或类似
    // 但之前 Result 类未给出，这里我们假定它包含 code 和 msg。
    // 为保险，我们检查 response.config 和实际后端。
    // 下面做一个简单处理：如果 data 有 code 且 code !== 200，则提示错误。
    if (res.code !== undefined && res.code !== 200) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    return res.data
  },
  (error) => {
    ElMessage.error(error.message || '服务器错误')
    return Promise.reject(error)
  }
)

export default service