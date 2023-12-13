import { Test, TestingModule } from '@nestjs/testing';
import { config as dotenvConfig } from 'dotenv';
import { ApplicationService } from './application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '@app/entities/application.entity';
import { UpdateResult } from 'typeorm';
dotenvConfig({ path: '.env.test' });

describe('ApplicationService', () => {
  let applicationService: ApplicationService;
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
          database: `${process.env.DATABASE_NAME}`,
          entities: [Application],
          logging: false,
          subscribers: [],
        }),
        TypeOrmModule.forFeature([Application]),
      ],
      providers: [ApplicationService],
    }).compile();

    applicationService = module.get<ApplicationService>(ApplicationService);
  });

  afterEach(async () => {
    await module?.close();
  });

  // Test if the service is defined
  it('service should be defined', () => {
    expect(applicationService).toBeDefined();
  });

  // test
  it('should return all applications', async () => {
    const applications = await applicationService.list();
    expect(applications).toEqual([]);
  });

  // test
  it('should return a single application', async () => {
    const application = await applicationService.show('1');
    expect(application).toEqual(null);
  });

  // test
  it('should create an application', async () => {
    const application = await applicationService.store({
      name: 'test',
      description: 'test',
    });
    expect(application).toEqual({
      name: 'test',
      description: 'test',
    });
  });

  // test
  it('should update an application', async () => {
    const application = await applicationService.update('1', {
      name: 'test',
      description: 'test',
    });

    const res = new UpdateResult();
    res.raw = [];
    res.generatedMaps = [];
    res.affected = 0;

    expect(application).toEqual(res);
  });

  // test
  it('should delete an application', async () => {
    const application = await applicationService.delete('1');
    expect(application).toEqual({ affected: 0, raw: [] });
  });
});
