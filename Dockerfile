# 使用官方 Node 镜像
FROM node:18

# 创建 app 目录
WORKDIR /usr/src/app

# 拷贝项目文件
COPY . .

# 安装依赖
RUN npm install && npm run build

# 安装 serve-static 所需模块（如果不是 dependencies 中）
RUN npm install express serve-static

# 启动服务
CMD [ "node", "server.js" ]

# Cloud Run 默认监听 8080
ENV PORT=8080
EXPOSE 8080
