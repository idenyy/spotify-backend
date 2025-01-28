import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmService } from './email-confirm.service';
import { EmailConfirmController } from './email-confirm.controller';
import { MailModule } from '@/common/libs/mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../user/user.service';
import { MailService } from '@/common/libs/mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from '@/config/jwt.config';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from '@/common/schemas/token.schema';
import { User, UserSchema } from '@/common/schemas/user.schema';
import { Account, AccountSchema } from '@/common/schemas/account.schema';

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      { name: User.name, schema: UserSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [EmailConfirmController],
  providers: [EmailConfirmService, JwtStrategy, UserService, MailService, AuthService],
  exports: [EmailConfirmService],
})
export class EmailConfirmModule {}
