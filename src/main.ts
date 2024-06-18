import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ThrottlerExceptionFilter } from './security/throttler-exception.filter';
import {NestExpressApplication} from "@nestjs/platform-express";
const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('public/upload/', {
    prefix: '/public/upload/',
  });
  app.use(helmet());
  app.useGlobalFilters(new ThrottlerExceptionFilter());
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
