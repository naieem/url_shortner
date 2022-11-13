import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT;

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({ credentials: true, origin: true });
  await app.listen(port);
  console.log('Application is running at port ' + port);
}
bootstrap();
