import { defineConfig, InlineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';

const root = process.cwd();
export default defineConfig({
  plugins: [
    eslintPlugin({
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/*.js', 'src/*.jsx'],
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(root, './src'),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      // 全局样式引入
      scss: {
        api: 'modern-compiler', // 或 "modern"，"legacy"
        importers: [],
        additionalData: `@use "@/style/variable.scss";`,
      },
    },
  },

  build: {
    target: 'modules',
    outDir: path.resolve(root, './dist'),
    rollupOptions: {},
    lib: {
      entry: path.resolve(root, './src/index.ts'),
      formats: ['umd', 'es'],
      name: 'w-calender',
    },
  },
}) as InlineConfig;
