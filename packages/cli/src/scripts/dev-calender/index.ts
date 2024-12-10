import { build } from 'vite';
import config from '../../configs/vite.calender.dev';

async function run() {
  await build(config);
  console.log('日历组件服务已启动');
}

export default run;
