import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@/modules/mongoose/mongoose.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MailModule } from './common/libs/mail/mail.module';
import { AppController } from './app.controller';
import { ResetPasswordModule } from '@/modules/reset-password/reset-password.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule,
    AuthModule,
    UserModule,
    MailModule,
    ResetPasswordModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
