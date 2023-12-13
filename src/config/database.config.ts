import { UserSubscriber } from '@app/entities/subscribers/user.subscriber';
import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: ['error', 'warn'],
  maxQueryExecutionTime: 100,
  entities: ['dist/entities/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: true,
  dropSchema: true,
  migrationsRun: true,
  migrationsTransactionMode: 'all',
  subscribers: [UserSubscriber],
};

export default registerAs('database', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
