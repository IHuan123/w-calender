import { defineConfig, InlineConfig, mergeConfig } from 'vite';

import viteCalenderBase from './vite.calender.base';

export default mergeConfig(viteCalenderBase, defineConfig({}), false) as InlineConfig;
