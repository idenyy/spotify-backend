import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

export const getMailerConfig = async (configService: ConfigService): Promise<MailerOptions> => ({
  transport: {
    service: configService.getOrThrow<string>('MAIL_SERVICE'),
    host: configService.getOrThrow<string>('MAIL_HOST'),
    port: configService.getOrThrow<string>('MAIL_PORT'),
    secure: false,
    auth: {
      user: configService.getOrThrow<string>('MAIL_LOGIN'),
      pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
    },
  },
  defaults: {
    from: `"Spotify" ${configService.getOrThrow<string>('MAIL_LOGIN')}`,
  },
});
