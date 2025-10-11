import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({ origin: process.env.CORS_ORIGINS?.split(',') ?? '*', credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 120
    })
  );

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap Nest application', error);
  process.exit(1);
});
