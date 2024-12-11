import { defineConfig, InlineConfig, mergeConfig } from 'vite';

import viteCalenderBase from './vite.calender.base';

export default mergeConfig(
  viteCalenderBase,
  defineConfig({
    mode: 'development',
    build: {
      sourcemap: true,
      watch: {},
    },
  }),
  false
) as InlineConfig;
