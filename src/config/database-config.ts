import * as path from 'path';

const baseDir = path.join(__dirname, '../');
const entitiesPath = `${baseDir}${process.env.TYPEORM_ENTITIES}`;
const migrationPath = `${baseDir}${process.env.TYPEORM_MIGRATIONS}`;

const getLogging = () => {
  if (process.env.TYPEORM_LOGGING === 'true') {
    return true;
  } else if (process.env.TYPEORM_LOGGING === 'false') {
    return false;
  } else if (process.env.TYPEORM_LOGGING && process.env.TYPEORM_LOGGING.trim().length > 0) {
    return process.env.TYPEORM_LOGGING.split(',');
  } else {
    return false;
  }
};

export default {
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: Number.parseInt(process.env.TYPEORM_PORT, 10),
  logging: getLogging(),
  entities: [entitiesPath],
  migrations: [migrationPath],
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
  seeds: [`src/db/seeds/*.seed.ts`],
  cli: {
    migrationsDir: 'src/db/migrations',
    entitiesDir: 'src/db/entities',
  }
};
