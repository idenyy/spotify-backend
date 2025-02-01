import { IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { AuthMethod } from '@/common/schemas/enums';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsString()
  @IsNotEmpty()
  picture: string;

  @IsString()
  @IsNotEmpty()
  method: AuthMethod;

  @IsBoolean()
  @IsNotEmpty()
  isVerified: boolean;
}
