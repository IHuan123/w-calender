import { createServer } from 'vite';
import config from '../../configs/vite.docs.dev';

async function run() {
  const server = await createServer(config);
  await server.listen(config.server?.port);
  console.log('日历服务已启动');
}

export default run;
