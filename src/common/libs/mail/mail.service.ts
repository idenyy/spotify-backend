import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { ConfirmationTemplate } from './templates/confirmation.template';
import { ResetPasswordTemplate } from '@/common/libs/mail/templates/reset-password.template';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendConfirmationEmail(name: string, email: string, token: string) {
    const html = await render(ConfirmationTemplate({ name, token }));

    return this.sendMail(email, 'Mail Confirmation', html);
  }

  public async sendResetPassword(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ResetPasswordTemplate({ domain, token }));

    return this.sendMail(email, 'Reset Password', html);
  }
  //
  // public async sendTwoFactorToken(email: string, token: string) {
  //   const html = await render(TwoFactorAuthTemplate({ token }));
  //
  //   return this.sendMail(email, "2FA", html);
  // }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      from: {
        name: 'Spotify',
        address: this.configService.getOrThrow<string>('MAIL_LOGIN'),
      },
      to: email,
      subject,
      html,
    });
  }
}
