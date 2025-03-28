import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // Set a global prefix for all routes
  app.setGlobalPrefix('api/v1');
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth() // Adds JWT auth if needed
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ✅ Manually set API order
  document.tags = [
    { name: 'Auth', description: 'Authentication APIs' }, // 👈 This appears first
    { name: 'Users', description: 'Users APIs' },
  ];

  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api/docs', app, document); // Swagger UI at /api
  }

  await app.listen(Number(process.env.PORT));
}
bootstrap();
