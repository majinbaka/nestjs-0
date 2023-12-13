import { User } from '@app/entities/user.entity';
import { Role } from '@app/enums/role.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User) // Inject the user repository
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: string[] = this.reflector.getAllAndOverride<string[]>(
      'roles', // This is a custom decorator we'll create
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    // get the user from database
    const user = await this.userRepository.findOne({
      where: { uuid: request.user.sub },
    });
    return requiredRoles.some(
      (role) => user?.role === Role[role as keyof typeof Role],
    );
  }
}
