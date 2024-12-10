import { defineConfig, InlineConfig, mergeConfig } from 'vite';
import path from 'path';

import viteCalenderBase from './vite.calender.base';

const root = process.cwd();
export default mergeConfig(
  viteCalenderBase,
  defineConfig({
    mode: 'development',
    build: {
      watch: {},
    },
  }),
  false
) as InlineConfig;
