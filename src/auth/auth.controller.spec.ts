import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@app/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSubscriber } from '@app/entities/subscribers/user.subscriber';
import { ValidationError, validate } from 'class-validator';
dotenvConfig({ path: '.env.test' });

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userRepository: Repository<User>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'), // Use the loaded config value
            signOptions: {
              expiresIn: '1h', // Token expiration (adjust as needed)
            },
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT || '3307'),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: `${process.env.DATABASE_NAME}`,
          entities: [User],
          logging: false,
          subscribers: [UserSubscriber],
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
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
    expect(authService).toBeDefined();
  });

  // Test if the repository is defined
  it('repository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  // Test if the controller have the signUp method
  it('should have signUp method', () => {
    expect(controller.signUp).toBeDefined();
  });

  // Test if the controller have the signIn method
  it('should have signIn method', () => {
    expect(controller.signIn).toBeDefined();
  });

  it('should validate the request body dto', async () => {
    const signInDto = new SignUpDto();
    const errors: ValidationError[] = await validate(signInDto);
    await expect(errors.length).toBe(3);
    await expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    await expect(errors[0].constraints).toHaveProperty('isString');
    await expect(errors[1].constraints).toHaveProperty('isStrongPassword');
    await expect(errors[2].constraints).toHaveProperty('isNotEmpty');
    await expect(errors[2].constraints).toHaveProperty('isString');
  });

  it('should validate the request body dto', async () => {
    const signInDto = new SignInDto();
    const errors = await validate(signInDto);
    await expect(errors.length).toBe(3);
    await expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    await expect(errors[0].constraints).toHaveProperty('isString');
    await expect(errors[1].constraints).toHaveProperty('isString');
    await expect(errors[1].constraints).toHaveProperty('isNotEmpty');
    await expect(errors[2].constraints).toHaveProperty('isNotEmpty');
    await expect(errors[2].constraints).toHaveProperty('isString');
  });

  it('signUp should return an object with access_token', async () => {
    authService.signUp = jest.fn().mockResolvedValue({
      access_token: 'test',
    });
    const result = await controller.signUp({
      username: 'test',
      password: 'test',
      device_token: 'test',
    });
    expect(result).toHaveProperty('access_token');
  });

  it('signIn should return an object with access_token', async () => {
    authService.signIn = jest.fn().mockResolvedValue({
      access_token: 'test',
    });
    const result = await controller.signIn({
      username: 'test',
      password: 'test',
      device_token: 'test',
    });
    expect(result).toHaveProperty('access_token');
  });

  it('should return the user profile', async () => {
    const user = {
      username: 'test',
      password: 'test',
      device_token: 'test',
    };
    const result = controller.getProfile(user, user);
    expect(result).toEqual(user);
  });
});
