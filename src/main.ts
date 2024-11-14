import {  NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { GlobalExceptionFilter } from './filters/globalException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  // app.useGlobalFilters(new GlobalExceptionFilter(app.get(HttpAdapterHost)))
  await app.listen(process.env.PORT);
}
bootstrap();
