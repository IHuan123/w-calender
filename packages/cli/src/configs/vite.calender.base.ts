import { defineConfig, InlineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';

const CSS_PREFIX = 'ch-calender';
const root = process.cwd();
export default defineConfig({
  define: {
    __CSS_PREFIX__: CSS_PREFIX,
  },
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
        additionalData: `$css-prefix: '${CSS_PREFIX}';`,
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
      name: 'ch-calender',
    },
  },
}) as InlineConfig;
