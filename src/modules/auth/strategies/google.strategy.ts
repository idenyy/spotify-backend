import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IOAuthUser } from '@/common/types/oauth-user';
import { AuthMethod } from '@/common/schemas/enums';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    console.log(
      'Google OAuth callbackURL:',
      configService.getOrThrow<string>('GOOGLE_REDIRECT_URI'),
    );

    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_REDIRECT_URI'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { id, emails, displayName, photos } = profile;
    const user: IOAuthUser = {
      provider: AuthMethod.GOOGLE,
      providerId: id,
      email: emails[0].value,
      name: displayName,
      picture: photos?.[0]?.value,
    };
    done(null, user);
  }
}
