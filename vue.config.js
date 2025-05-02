const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://viajuntos-backend-284495715917.europe-southwest1.run.app/',  // 后端的API地址
        changeOrigin: true,              // 如果后端是 HTTPS 协议，设置为 true
        secure: false,                  // 如果后端使用的是自签名证书，可以设置为 false
        pathRewrite: {
          '^/api': '',                  // 如果你希望删除路径前缀 `/api`
        },
      },
    },
  },
});
