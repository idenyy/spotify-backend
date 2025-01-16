import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignupDto } from './dto/signup.dto';
import { Response } from 'express';
import { verify } from 'argon2';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailConfirmService } from '../email-confirm/email-confirm.service';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwt: JwtService,
    private readonly userService: UserService,
    private readonly emailConfirmService: EmailConfirmService,
  ) {}

  public async signup(dto: SignupDto) {
    const isExists = await this.userService.findByEmail(dto.email);
    if (isExists) throw new ConflictException('The email you provided is already in use');

    await this.emailConfirmService.sendVerificationToken({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });

    return {
      message: 'Registration successful! Check your email to confirm your account',
    };
  }

  public async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, dto.password);
    if (!isValid) throw new BadRequestException('Incorrect password. Please try again');

    const tokens = this.issueTokens(user._id as Types.ObjectId);

    return { user, ...tokens };
  }

  public issueTokens(userId: Types.ObjectId) {
    const payload = { id: userId };

    const accessToken = this.jwt.sign(payload, {
      expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_AGE'),
    });

    const refreshToken = this.jwt.sign(payload, {
      expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_AGE'),
    });

    return { accessToken, refreshToken };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const { password, ...user } = await this.userService.findById(result.id);

    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  addRefreshToken(res: Response, refreshToken: string) {
    const expires = new Date();
    expires.setDate(
      expires.getDate() + this.configService.getOrThrow<number>('COOKIES_REFRESH_TOKEN_AGE'),
    );

    res.cookie(this.configService.getOrThrow<string>('COOKIES_REFRESH_TOKEN_NAME'), refreshToken, {
      httpOnly: true,
      expires,
      secure: true,
      sameSite: 'lax',
    });
  }

  removeRefreshToken(res: Response) {
    res.cookie(this.configService.getOrThrow<string>('COOKIES_REFRESH_TOKEN_NAME'), '', {
      httpOnly: true,
      expires: new Date(0),
      secure: this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
    });
  }
}
