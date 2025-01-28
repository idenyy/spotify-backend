import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
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
import { OAuthUser } from '@/common/types/oauth-user';
import { OAuthProvider } from '@/common/schemas/enums';

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

  @Get(':provider')
  @UseGuards(AuthGuard(':provider'))
  async auth(
    @Req() req: Request,
    @Param('provider', new ParseEnumPipe(OAuthProvider)) provider: string,
  ) {}

  @Get(':provider/callback')
  @UseGuards(AuthGuard(':provider'))
  async authRedirect(
    @Req() req: Request,
    @Res() res: Response,
    @Param('provider', new ParseEnumPipe(OAuthProvider)) provider: string,
  ) {
    const user = req.user as OAuthUser;
    const tokens = await this.authService.validateOAuthUser(user.provider, user.providerId, user);
    this.authService.addRefreshToken(res, tokens.refreshToken);
    res.redirect(`${this.configService.getOrThrow<string>('APPLICATION_URL')}`);
    return { user, token: tokens.accessToken };
  }

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
