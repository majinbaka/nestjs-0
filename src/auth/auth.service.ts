import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/auth.dto';
import { Repository } from 'typeorm';
import { User } from '@app/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@app/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(params: SignUpDto): Promise<any> {
    const user = await this.userRepository.findOneBy({
      username: params.username,
      isActive: true,
      role: Role.User,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await compare(params.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.uuid, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(params: SignUpDto): Promise<any> {
    const user = await this.userRepository.findOneBy({
      username: params.username,
    });
    if (user) {
      throw new UnauthorizedException();
    }
    const newUser = this.userRepository.create({
      ...params,
      role: Role.User,
    });
    await this.userRepository.save(newUser);
    return {
      access_token: await this.jwtService.signAsync({ sub: newUser.uuid }),
    };
  }
}
