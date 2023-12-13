import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { ValidationError, validate } from 'class-validator';
import { Application } from '@app/entities/application.entity';
import { StoreDto } from './dto/application.dto';
dotenvConfig({ path: '.env.test' });

describe('ApplicationController', () => {
  let controller: ApplicationController;
  let applicationService: ApplicationService;
  let applicationRepository: Repository<Application>;
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
      controllers: [ApplicationController],
      providers: [ApplicationService],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
    applicationService = module.get<ApplicationService>(ApplicationService);
    applicationRepository = module.get<Repository<Application>>(
      getRepositoryToken(Application),
    );
  });

  afterEach(async () => {
    await module.close();
  });

  // Test if the controller is defined
  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test if the service is defined
  it('service should be defined', () => {
    expect(applicationService).toBeDefined();
  });

  // Test if the repository is defined
  it('repository should be defined', () => {
    expect(applicationRepository).toBeDefined();
  });

  // Test if the controller have the store
  it('should have store method', () => {
    expect(controller.store).toBeDefined();
  });

  it('should have show method', () => {
    expect(controller.show).toBeDefined();
  });

  it('should have update method', () => {
    expect(controller.update).toBeDefined();
  });

  it('should have destroy method', () => {
    expect(controller.delete).toBeDefined();
  });

  it('should have list method', () => {
    expect(controller.list).toBeDefined();
  });

  it('should validate the request body dto', async () => {
    const signInDto = new StoreDto();
    const errors: ValidationError[] = await validate(signInDto);
    await expect(errors.length).toBe(3);
    await expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    await expect(errors[0].constraints).toHaveProperty('isString');
    await expect(errors[1].constraints).toHaveProperty('isString');
    await expect(errors[1].constraints).toHaveProperty('isNotEmpty');
    await expect(errors[2].constraints).toHaveProperty('isNotEmpty');
    await expect(errors[2].constraints).toHaveProperty('isString');
  });

  it('list should return an object with access_token', async () => {
    applicationService.list = jest.fn().mockResolvedValue([]);
    const result = await controller.list();
    expect(result).toEqual([]);
  });

  it('show should return an object with access_token', async () => {
    applicationService.show = jest.fn().mockResolvedValue(undefined);
    const result = await controller.show('1');
    expect(result).toEqual(undefined);
  });

  it('store should return an object with access_token', async () => {
    applicationService.store = jest.fn().mockResolvedValue({
      name: 'test',
      description: 'test',
      version: 'test',
    });
    const result = await controller.store({
      name: 'test',
      description: 'test',
      version: 'test',
    });
    expect(result).toEqual({
      name: 'test',
      description: 'test',
      version: 'test',
    });
  });

  it('update should return an object with access_token', async () => {
    applicationService.update = jest.fn().mockResolvedValue({
      name: 'test',
      description: 'test',
      version: 'test',
    });
    const result = await controller.update(
      {
        name: 'test',
        description: 'test',
        version: 'test',
      },
      '1',
    );
    expect(result).toEqual({
      name: 'test',
      description: 'test',
      version: 'test',
    });
  });

  it('delete should return an object with access_token', async () => {
    applicationService.delete = jest.fn().mockResolvedValue(undefined);
    const result = await controller.delete('1');
    expect(result).toEqual(undefined);
  });
});
