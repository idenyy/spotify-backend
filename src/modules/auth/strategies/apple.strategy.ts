import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-apple';
import { ConfigService } from '@nestjs/config';
import { OAuthUser } from '@/common/types/oauth-user';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('APPLE_CLIENT_ID'),
      teamID: configService.getOrThrow<string>('APPLE_TEAM_ID'),
      keyID: configService.getOrThrow<string>('APPLE_KEY_ID'),
      key: configService.getOrThrow<string>('APPLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      callbackURL: `${configService.getOrThrow<string>('MAIN_ORIGIN')}/auth/apple/callback`,
      scope: ['name', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { id, emails, name } = profile;
    const user: OAuthUser = {
      provider: 'APPLE',
      providerId: id,
      email: emails?.[0]?.value || '',
      name: name || 'Apple User',
      picture: null,
    };
    done(null, user);
  }
}
