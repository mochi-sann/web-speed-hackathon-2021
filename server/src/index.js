import http from 'http';

import { app } from './app';

async function main() {
  const server = http.createServer(app);

  // データベースの初期化をします

  server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => {
    const address = server.address();
    console.log(`Listening on ${address.address}:${address.port}`);
  });
}

main().catch(console.error);
