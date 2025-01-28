import {
  BadRequestException,
  ConflictException,
  Injectable,
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
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TokenDocument } from '@/common/schemas/token.schema';
import { OAuthUser } from '@/common/types/oauth-user';
import { User } from '@/common/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwt: JwtService,
    private readonly userService: UserService,
    private readonly emailConfirmService: EmailConfirmService,
    @InjectModel('Account') private readonly accountModel: Model<TokenDocument>,
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
    if (!user) throw new BadRequestException('Email or password incorrect');

    const isValid = await verify(user.password, dto.password);
    if (!isValid) throw new BadRequestException('Email or password incorrect');

    const tokens = this.issueTokens(user._id as Types.ObjectId);

    return { user, ...tokens };
  }

  async validateOAuthUser(provider: string, providerId: string, userData: OAuthUser) {
    let user: User = await this.userService.findByEmail(userData.email);
    if (!user)
      user = await this.userService.create(
        userData.name,
        userData.email,
        '',
        userData.picture,
        provider.toUpperCase(),
        true,
      );

    const account = await this.accountModel.findOne({ provider, providerId });

    if (!account) {
      await this.accountModel.create({
        provider,
        providerId,
        user: user._id,
      });
    }

    return this.issueTokens(user._id);
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
      httpOnly: this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      expires,
      secure: this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
    });
  }

  removeRefreshToken(res: Response) {
    res.cookie(this.configService.getOrThrow<string>('COOKIES_REFRESH_TOKEN_NAME'), '', {
      httpOnly: this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      expires: new Date(0),
      secure: this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
    });
  }
}
