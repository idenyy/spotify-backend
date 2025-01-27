import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { UserService } from '@/modules/user/user.service';
import { MailService } from '@/common/libs/mail/mail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from '@/common/schemas/token.schema';
import { UserSchema } from '@/common/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Token', schema: TokenSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, UserService, MailService],
})
export class ResetPasswordModule {}
