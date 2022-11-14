import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT;

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({ credentials: true, origin: true });
  app.useGlobalPipes(new ValidationPipe());
  // Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('SWAGGER_TITLE'))
    .setDescription(configService.get<string>('SWAGGER_DESCRIPTION'))
    .setVersion(configService.get<string>('SWAGGER_VERSION'))
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log('Application is running at port ' + port);
}
bootstrap();
