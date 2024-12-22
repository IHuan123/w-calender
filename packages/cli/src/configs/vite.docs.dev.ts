import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [],
  mode: 'development',
  server: {
    port: 5000,
    open: true,
    hmr: true,
  },
});
