import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // to add validations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Additional properties sent in the body of POST requests are stripped out
    }),
  );
  await app.listen(3001);
}
bootstrap();
