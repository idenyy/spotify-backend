import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as process from 'node:process';

config();

export const isDev = (configService: ConfigService) => {
  return configService.getOrThrow<string>('NODE_ENV') === 'development';
};

export const IS_DEV_ENV = process.env.NODE_ENV === 'development';
