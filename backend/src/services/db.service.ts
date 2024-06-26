import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE } from '@/configs';
import { logger } from '@/utils/logger';
import { join } from 'path';
import { Service } from 'typedi';
import { createConnection, Connection, ConnectionOptions } from 'typeorm';

@Service()
export class TypeOrmDBConnectionHolder {
  private databaseClient: Connection | null = null;

  async initialize(connectionName?: string): Promise<void> {
    if (this.databaseClient !== null) return;
    this.databaseClient = await this.generateConnection(connectionName);
  }

  private async generateConnection(connectionName?: string): Promise<Connection> {
    const dbConfig: ConnectionOptions = {
      name: 'interview-test',
      type: 'postgres',
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      host: POSTGRES_HOST,
      port: +POSTGRES_PORT,
      database: POSTGRES_DATABASE,
      synchronize: true,
      logging: false,
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
      cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migration',
      },
    };
    try {
      const result = await createConnection(dbConfig);
      logger.info(`Database - Create connection DB: connectionName: ${result.name} `);
      return result;
    } catch (error) {
      console.log(error, 'error');
    }
  }

  getInstance(): Connection {
    // throw error when we have no prisma client after initialization.
    if (this.databaseClient === null) {
      throw new Error('Please call initialize() once before calling this method if you can.');
    }
    return this.databaseClient;
  }

  async close() {
    // do nothing when we have no Prisma instance.
    if (this.databaseClient === null) return;
    await this.databaseClient.close();
    this.databaseClient = null;
  }
}
