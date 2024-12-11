import { build } from 'vite';
import config from '../../configs/vite.calender.prod';

async function run() {
  try {
    await build(config);
    console.log('INFO:calender component build success!');
  } catch (error) {
    console.error('ERROR:', error);
  }
}

export default run;
