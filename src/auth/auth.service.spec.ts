import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@app/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { SignUpDto } from './dto/auth.dto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSubscriber } from '@app/entities/subscribers/user.subscriber';
import { validate } from 'class-validator';
import * as bycrypt from 'bcrypt';
dotenvConfig({ path: '.env.test' });

describe('AuthService', () => {
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

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(async () => {
    await module.close();
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
    expect(authService.signUp).toBeDefined();
  });

  // Test if the controller have the signIn method
  it('should have signIn method', () => {
    expect(authService.signIn).toBeDefined();
  });

  // Sign up
  // 1. should return an object with access_token
  // 2. should bycrypt the password
  // 3. should call signUp method of authService
  // 4. should throw an error if user already exists
  // 5. should validate the request body dto
  it('should return an object with access_token', async () => {
    const result = await authService.signUp({
      username: `test_auth_${Date.now()}`,
      password: 'test',
      device_token: 'test',
    });
    expect(result).toHaveProperty('access_token');
  });

  it('should bycrypt the password', async () => {
    await authService.signUp({
      username: `test_auth_${Date.now()}`,
      password: 'test',
      device_token: 'test',
    });
    const user = await userRepository.findOne({ where: { username: 'test' } });
    expect(user?.password).not.toBe('test');
  });

  it('should call signUp method of authService', async () => {
    const signUpSpy = jest.spyOn(authService, 'signUp');
    await authService.signUp({
      username: `test_auth_${Date.now()}`,
      password: 'test',
      device_token: 'test',
    });
    expect(signUpSpy).toHaveBeenCalled();
  });

  it('should throw an error if user already exists', async () => {
    jest
      .spyOn(userRepository, 'findOneBy')
      .mockImplementation(async () => new User());
    await expect(
      authService.signUp({
        username: `test_auth_${Date.now()}`,
        password: 'test',
        device_token: 'test',
      }),
    ).rejects.toThrow();
  });

  it('should validate the request body dto', async () => {
    const signUpDto = new SignUpDto();
    const errors = await validate(signUpDto);
    await expect(errors.length).toBe(3);
  });

  // Sign in
  // 1. should return an object with access_token
  // 2. should call signIn method of authService
  // 3. should throw an error if user does not exist
  // 4. should validate the request body dto
  it('should return an object with access_token', async () => {
    // findOneBy
    jest.spyOn(userRepository, 'findOneBy').mockImplementation(async () => {
      const user = new User();
      user.password = bycrypt.hashSync('test', 10);
      return user;
    });

    const result = await authService.signIn({
      username: `test_auth_${Date.now()}`,
      password: 'test',
      device_token: 'test',
    });
    expect(result).toHaveProperty('access_token');
  });

  it('should call signIn method of authService', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockImplementation(async () => {
      const user = new User();
      user.password = bycrypt.hashSync('test', 10);
      return user;
    });
    const signInSpy = jest.spyOn(authService, 'signIn');
    await authService.signIn({
      username: `test_auth_${Date.now()}`,
      password: 'test',
      device_token: 'test',
    });
    expect(signInSpy).toHaveBeenCalled();
  });

  it('should throw an error if user does not exist', async () => {
    jest
      .spyOn(userRepository, 'findOneBy')
      .mockImplementation(async () => null);
    await expect(
      authService.signIn({
        username: `test_auth_${Date.now()}`,
        password: 'test',
        device_token: 'test',
      }),
    ).rejects.toThrow();
  });

  it('should throw an error if user does not exist', async () => {
    jest
      .spyOn(userRepository, 'findOneBy')
      .mockImplementation(async () => null);
    await expect(
      authService.signIn({
        username: `test_auth_${Date.now()}`,
        password: 'test',
        device_token: 'test',
      }),
    ).rejects.toThrow();
  });

  it('should throw an error if password not match', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockImplementation(async () => {
      const user = new User();
      user.password = bycrypt.hashSync('test123', 10);
      return user;
    });
    await expect(
      authService.signIn({
        username: `test_auth_${Date.now()}`,
        password: 'test',
        device_token: 'test',
      }),
    ).rejects.toThrow();
  });
});
