import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserSubscriber } from '@app/entities/subscribers/user.subscriber';
import { User } from '@app/entities/user.entity';
import { AppModule } from '@app/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT || '3307'),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: `${process.env.DATABASE_NAME}_test`,
          entities: [User],
          dropSchema: true,
          logging: false,
          synchronize: true,
          subscribers: [UserSubscriber],
        }),
        TypeOrmModule.forFeature([User]),
        AppModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await module.close();
  });

  // Add more tests here Sign up and sign in
  it('/auth/sign-up (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        username: 'test',
        password: 'password',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
      });
  });

  it('/auth/sign-in (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        username: 'test',
        password: 'password',
      })
      .expect(401);
  });
});
