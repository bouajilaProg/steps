import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsWebOrigin = configService.get<string>('CORS_WEB_ORIGIN');
  const corsAdminOrigin = configService.get<string>('CORS_ADMIN_ORIGIN');
  const corsOrigins = [
    corsWebOrigin,
    corsAdminOrigin,
    'http://localhost:16010',
    'http://localhost:16011',
    'http://127.0.0.1:16010',
    'http://127.0.0.1:16011',
  ].filter(Boolean);

  app.enableCors({
    origin: [...new Set(corsOrigins)],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Steps API')
    .setDescription('Healthcare process management API')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
