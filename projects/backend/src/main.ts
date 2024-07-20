import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { setupSwagger } from './common/utils/setup-swagger';
import { ConfigService } from '@nestjs/config';

config();
const configService = new ConfigService();

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', { exclude: ['/'] });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  setupSwagger(app);

  await app.listen(configService.get('PORT_API'));
  const url = await app
    .getUrl()
    .then((url) =>
      url.includes('[::1]') ? url.replace('[::1]', 'localhost') : url,
    );
  logger.verbose(`Server is running on ${url}`);
}
bootstrap();
