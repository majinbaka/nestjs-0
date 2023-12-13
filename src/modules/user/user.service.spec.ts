import { Test, TestingModule } from '@nestjs/testing';
import { config as dotenvConfig } from 'dotenv';
import { UserService } from './user.service';
dotenvConfig({ path: '.env.test' });

describe('UserService', () => {
  let userService: UserService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    await module.close();
  });

  // Test if the service is defined
  it('service should be defined', () => {
    expect(userService).toBeDefined();
  });
});
