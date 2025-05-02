const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: 'src/main.js',
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://viajuntos-backend-284495715917.europe-southwest1.run.app/',
        // target: 'http://127.0.0.1:5000',  
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
});
