import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordDto } from '@/modules/reset-password/dto/reset-password.dto';
import { NewPasswordDto } from '@/modules/reset-password/dto/new-password.dto';
import { Authorization } from '@/common/decorators/auth.decorator';
import { Authorized } from '@/common/decorators/authorized.decorator';

@Controller('auth/reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Authorization()
  @Post()
  @HttpCode(HttpStatus.OK)
  public async resetPassword(@Body() dto: ResetPasswordDto, @Authorized('_id') userId: string) {
    return this.resetPasswordService.resetPassword(dto, userId);
  }

  @Authorization()
  @Post('new/:token')
  @HttpCode(HttpStatus.OK)
  public async newPassword(@Body() dto: NewPasswordDto, @Param('token') token: string) {
    return this.resetPasswordService.newPassword(dto, token);
  }
}
