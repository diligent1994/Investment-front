import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  const useProxy = env.VITE_USE_PROXY === 'true'
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:8080'
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: 3000,
      // 容器化部署需监听所有地址（否则外部无法访问）
      host: '0.0.0.0',
      proxy: useProxy ? {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
                    // 可选：若后端context-path不是/api，需调整rewrite
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          // 可选：容器网络可能需要关闭SSL验证（若用http）
          secure: false
        }
      } : {}
    },
    // 构建配置（容器化部署需确保静态资源路径正确）
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      // 若前端部署在子路径，需配置base
      // base: '/frontend/'
    }
  }
})