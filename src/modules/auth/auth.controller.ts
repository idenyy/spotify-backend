import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { IOAuthUser } from '@/common/types/oauth-user';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  public async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);

    this.authService.addRefreshToken(res, refreshToken);

    return response;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as IOAuthUser;
    const response = await this.authService.validateOAuthUser(
      user.provider,
      user.providerId,
      user,
      res,
    );

    res.redirect(this.configService.getOrThrow<string>('ALLOWED_ORIGIN'));
    return { accessToken: response.accessToken };
  }

  // @Get('facebook')
  // @UseGuards(AuthGuard('facebook'))
  // async facebookAuth() {}
  //
  // @Get('facebook/callback')
  // @UseGuards(AuthGuard('facebook'))
  // async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
  //   const user = req.user as IOAuthUser;
  //   const tokens = await this.authService.validateIOAuthUser(user.provider, user.providerId, user);
  //   this.authService.addRefreshToken(res, tokens.refreshToken);
  //   res.redirect(`${this.configService.getOrThrow<string>('APPLICATION_URL')}`);
  //   return { user, token: tokens.accessToken };
  // }
  //
  // @Get('apple')
  // @UseGuards(AuthGuard('apple'))
  // async appleAuth() {}
  //
  // @Get('apple/callback')
  // @UseGuards(AuthGuard('apple'))
  // async appleAuthRedirect(@Req() req: Request, @Res() res: Response) {
  //   const user = req.user as IOAuthUser;
  //   const tokens = await this.authService.validateIOAuthUser(user.provider, user.providerId, user);
  //   this.authService.addRefreshToken(res, tokens.refreshToken);
  //   res.redirect(`${this.configService.getOrThrow<string>('APPLICATION_URL')}`);
  //   return { user, token: tokens.accessToken };
  // }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async newTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenFromCookies =
      req.cookies[this.configService.getOrThrow<string>('COOKIES_REFRESH_TOKEN_NAME')];

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshToken(res);
      throw new UnauthorizedException('Refresh token expired');
    }

    const { refreshToken, ...response } =
      await this.authService.getNewTokens(refreshTokenFromCookies);

    return response;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshToken(res);
    return true;
  }
}
