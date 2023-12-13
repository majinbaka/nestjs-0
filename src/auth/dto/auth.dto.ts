import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  device_token: string;
}

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  device_token: string;
}
