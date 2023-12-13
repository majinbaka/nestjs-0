import { DataSource } from 'typeorm'; // Import DataSource instead of createConnection
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env.test' });
module.exports = async () => {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '3307'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: `${process.env.DATABASE_NAME}`,
    entities: ['dist/entities/*.entity{.ts,.js}'],
    dropSchema: true,
    synchronize: true,
    logging: false,
    subscribers: [],
  });
  await dataSource.initialize(); // Initialize the data source
  (global as any).dataSource = dataSource; // Make it accessible globally (if needed)
};
