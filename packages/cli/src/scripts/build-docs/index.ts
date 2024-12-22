import { build } from 'vite';
import config from '../../configs/vite.docs.prod';

async function run() {
  try {
    await build(config);
    console.log('INFO:docs build success!');
  } catch (error) {
    console.error('ERROR:', error);
  }
}

export default run;
