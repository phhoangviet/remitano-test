import { join } from 'path';
import { createConnection, ConnectionOptions } from 'typeorm';
import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE } from 'configs';
import { logger } from '@/utils/logger';

export const dbConnection = async () => {
  const dbConfig: ConnectionOptions = {
    type: 'postgres',
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    port: +POSTGRES_PORT,
    database: POSTGRES_DATABASE,
    synchronize: true,
    logging: false,
    entities: ['../entities/*.entity.ts'],
    migrations: ['../migration/*.ts'],
    cli: {
      entitiesDir: '../entities',
      migrationsDir: '../migration',
    },
  };
  logger.info('======= Connecting Database =======');
  const res = await createConnection(dbConfig);
  logger.info(`======= DB Connected: ${res.isConnected} =======`);
};
