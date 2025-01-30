import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { OAuthUser } from '@/common/types/oauth-user';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: `${configService.getOrThrow<string>('MAIN_ORIGIN')}/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void,
  ) {
    const { id, emails, displayName, photos } = profile;
    const user: OAuthUser = {
      provider: 'FACEBOOK',
      providerId: id,
      email: emails?.[0]?.value || '',
      name: displayName,
      picture: photos?.[0]?.value,
    };
    done(null, user);
  }
}
