# ======================
# 阶段1：Node 22 环境（满足Vite8.0强制版本要求）自动打包 dist
# ======================
FROM node:22-alpine AS builder
WORKDIR /app

# 复制依赖配置
COPY package*.json ./

# 淘宝npm镜像加速（解决国内安装慢/失败）
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install

# 复制全部源码
COPY . .

# ✅ 继续使用你项目原生打包命令，完全适配package.json
RUN npm run build:prod

# ======================
# 阶段2：Nginx 运行静态文件（无阿里云权限报错+跨域代理+路由404）
# ======================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 删除默认文件 & 配置
RUN rm -rf ./* /etc/nginx/conf.d/default.conf

# 从构建阶段复制流水线自动打包好的 dist
COPY --from=builder /app/dist ./

# 复制你的Nginx反向代理配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]