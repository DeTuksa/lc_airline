import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  const config = new DocumentBuilder()
    .setTitle('LC-Airline API')
    .setDescription('The LC-Airline API documentation')
    .setVersion('1.0')
    .addOAuth2()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.use(json({ limit: '50mb' }));
  app.enableCors()
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(3000, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:3000`);
  });
}
bootstrap();
