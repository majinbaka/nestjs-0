import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { User } from '@app/entities/user.entity';
import { Repository } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '@app/enums/role.enum';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ExecutionContext } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import { UserSubscriber } from '@app/entities/subscribers/user.subscriber';
dotenvConfig({ path: '.env.test' });

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
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
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let context: ExecutionContext;
    let user: User;

    beforeEach(async () => {
      user = new User();
      user.role = Role.User;
      user.username = `test_roles_guard_${Date.now()}`;
      user.password = 'password';
      await userRepository.upsert(user, {
        conflictPaths: ['username'], // Or other unique columns
        skipUpdateIfNoValuesChanged: true,
      });
      const requestMock = { user: { sub: user.uuid } } as any; // Mock request
      context = new ExecutionContextHost([requestMock]);
    });

    it('should return true if user has required role', async () => {
      const requiredRoles = ['User'];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
      const canActivate = await guard.canActivate(context);
      expect(canActivate).toBe(true);
    });

    it('should return true if no roles are required', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined); // No roles
      const canActivate = await guard.canActivate(context);
      expect(canActivate).toBe(true);
    });

    it('should return false if user does not have required role', async () => {
      const requiredRoles = ['Admin'];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
      const canActivate = await guard.canActivate(context);
      expect(canActivate).toBe(false);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      const canActivate = await guard.canActivate(context);
      await expect(canActivate).toBe(true);
    });
  });
});
