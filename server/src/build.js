import { insertSeeds } from './seeds';
import { sequelize } from './sequelize';

async function main() {
  // データベースの初期化をします
  await sequelize.sync({
    force: true,
    logging: false,
  });
  return await insertSeeds();
}
main().catch(console.error);
