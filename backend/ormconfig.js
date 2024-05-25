module.exports = [
  {
    name: 'interview-test',
    type: 'postgres',
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
    synchronize: false,
    logging: false,
    maxQueryExecutionTime: 1000,
    entities: ['src/entities/*.entity.ts'],
    migrations: ['src/migration/*.ts'],

    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migration',
    },
  },
];
