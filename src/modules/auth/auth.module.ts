import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '@/config/jwt.config';
import { EmailConfirmModule } from '../email-confirm/email-confirm.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '@/common/schemas/account.schema';
import { GoogleStrategy } from '@/modules/auth/strategies/google.strategy';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    forwardRef(() => EmailConfirmModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ConfigService, GoogleStrategy],
})
export class AuthModule {}
