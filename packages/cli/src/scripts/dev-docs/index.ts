import { createServer } from 'vite';
import config from '../../configs/vite.docs.dev';

async function run() {
  const server = await createServer(config);
  await server.listen(config.server?.port);
  console.log(`document server start,server: http://localhost:${config.server?.port}`);
}

export default run;
