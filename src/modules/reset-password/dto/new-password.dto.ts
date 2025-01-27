import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
