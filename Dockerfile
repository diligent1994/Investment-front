# 第一阶段：构建（可选，如果已经在本地构建好了 dist，可以跳过）
# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# 第二阶段：使用 nginx 提供静态服务
FROM nginx:alpine
# 删除Nginx默认首页
RUN rm -rf /usr/share/nginx/html/*
# 把本地dist目录的静态文件复制到Nginx默认静态目录
COPY dist/ /usr/share/nginx/html/
# COPY --from=builder /app/dist /usr/share/nginx/html
# 复制自定义 nginx 配置（可选，用于处理前端路由）
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]