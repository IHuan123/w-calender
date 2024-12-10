import { defineConfig, InlineConfig } from 'vite';
// import path from 'path';
export default defineConfig({
  plugins: [],
  mode: 'development',
  server: {
    port: 5000,
    open: true,
    hmr: true,
  },
  css: {
    // postcss: path.resolve(__dirname, '../../'),
    preprocessorOptions: {
      // 全局样式引入
      scss: {
        api: 'modern', // 或 "modern"，"legacy"
      },
    },
  },
}) as InlineConfig;
