import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeORMTestingModule = (entities: any[], subscribers: any[]) =>
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '3307'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: `${process.env.DATABASE_NAME}_test`,
    entities: [...entities],
    dropSchema: true,
    logging: false,
    subscribers: [...subscribers],
  }),
