import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { CorrelationIdMiddleware } from './utils/correlation-id.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 1. SEMUA KONFIGURASI HARUS DI SINI, SEBELUM APP.LISTEN()

  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const logger = app.get(Logger);

  app.disable('x-powered-by');
  app.use(CorrelationIdMiddleware());
  app.useLogger(logger);

  // KONFIGURASI CORS YANG BENAR DAN SPESIFIK
  app.enableCors({
    origin: 'http://localhost:3000', // Alamat frontend Anda
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('apidocs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('port') || 3001; // Pastikan ada port default
  const hostname = '0.0.0.0';

  // 2. APP.LISTEN() MENJADI PERINTAH TERAKHIR DALAM BLOK SETUP
  await app.listen(port, hostname);
  
  // 3. LOG INI DITAMPILKAN SETELAH SERVER BENAR-BENAR SIAP
  logger.log(`Server running on http://${hostname}:${port}`, 'Bootstrap');
  logger.log(`Swagger UI available at http://${hostname}:${port}/api`, 'Bootstrap');
}

bootstrap();