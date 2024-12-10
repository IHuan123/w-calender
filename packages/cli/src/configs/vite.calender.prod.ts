import { defineConfig, InlineConfig, mergeConfig } from 'vite';
import viteCalenderBase from './vite.calender.base';

export default mergeConfig(defineConfig({}), viteCalenderBase) as InlineConfig;
