import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValue({ userId: '123' }),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let context: ExecutionContext;

    beforeEach(() => {
      const requestMock = {
        headers: { authorization: 'Bearer valid.jwt.token' },
      } as any;
      context = new ExecutionContextHost([requestMock]);
    });

    it('should return true for public routes', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
      const canActivate = await guard.canActivate(context);
      expect(canActivate).toBe(true);
    });

    it('should throw UnauthorizedException for missing token', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      context.switchToHttp().getRequest().headers.authorization = undefined;
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should validate token and return true', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      const canActivate = await guard.canActivate(context);
      expect(canActivate).toBe(true);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid.jwt.token', {
        secret: process.env.JWT_SECRET,
      });
      expect(context.switchToHttp().getRequest()['user']).toBeDefined();
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
