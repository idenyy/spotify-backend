import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { EmailConfirmService } from './email-confirm.service';
import { ConfirmationDto } from './dto/email-confirm.dto';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';

@Controller('auth/confirmation')
export class EmailConfirmController {
  constructor(
    private readonly emailConfirmService: EmailConfirmService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async verification(
    @Body() dto: ConfirmationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, ...user } = await this.emailConfirmService.verification(dto);
    this.authService.addRefreshToken(res, refreshToken);

    return {
      message: 'Your email has been successfully verified',
      user,
      accessToken,
    };
  }
}
