import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(passport.initialize());
  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    origin: [config.getOrThrow<string>('ALLOWED_ORIGIN'), config.getOrThrow<string>('MAIN_ORIGIN')],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  await app.listen(config.getOrThrow<number>('PORT'));
}

bootstrap();
