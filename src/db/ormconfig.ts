import { ConnectionOptions } from 'typeorm';
import * as env from 'dotenv';
import * as fs from 'fs';

const environment = process.env.NODE_ENV || 'local';
const envSheet: any = env.parse(fs.readFileSync(`${environment}.env`));

// This configuration is meant to serve Typeorm CLI only
const config: ConnectionOptions = {
  type: envSheet.DB_TYPE,
  host: envSheet.DB_HOST,
  port: envSheet.DB_PORT,
  username: envSheet.DB_USERNAME,
  password: envSheet.DB_PASSWORD,
  database: envSheet.DB_NAME,
  synchronize: environment === 'local',
  entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migration/**/*{.ts,.js}`],
  cli: {
    migrationsDir: 'src/db/migration',
  },
};

export = config;
