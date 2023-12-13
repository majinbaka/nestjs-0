import { AppModule } from '@app/app.module';
import { CLogger } from '@app/loggers/logger.service';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CLogger(),
    cors: true,
  });

  // Add the logger to the app
  app.useLogger(app.get(CLogger));

  // Add the swagger documentation
  const config = new DocumentBuilder()
    .setTitle('NESTJS API')
    .setDescription('The NESTJS API description')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  // Add compression and helmet
  app.use(compression());
  app.use(helmet());

  // Add the global pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Add the versioning
  app.enableVersioning({ type: VersioningType.URI });

  await app.listen(3000);
}
bootstrap();
