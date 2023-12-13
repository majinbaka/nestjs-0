import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { Public } from '@app/decorators/public.decorator';
import { CurrentUser } from '@app/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @Public()
  async signIn(@Body() signInPayload: SignInDto) {
    return this.authService.signIn(signInPayload);
  }

  // register
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  @Public()
  async signUp(@Body() signUpPayload: SignUpDto) {
    return await this.authService.signUp(signUpPayload);
  }

  @Get('profile')
  getProfile(@Request() req: any, @CurrentUser() user: any) {
    return user;
  }
}
