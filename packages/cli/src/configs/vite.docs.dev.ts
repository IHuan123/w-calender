import { defineConfig, InlineConfig, mergeConfig } from 'vite';
import viteCalenderBase from './vite.calender.base';
// import path from 'path';
export default defineConfig({
  plugins: [],
  mode: 'development',
  server: {
    port: 5000,
    open: true,
    hmr: true,
  },
});
