import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TypeOrmFilter } from '@/shared/filters/typeorm-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  app.enableVersioning({ type: VersioningType.URI });

  app.enableShutdownHooks();
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new TypeOrmFilter());

  /** Swagger configuration */
  const options = new DocumentBuilder()
    .setTitle('모션랩스 백엔드 과제')
    .setVersion('1.0.0')
    .setDescription('엑셀 파일을 통한 환자 정보 업로드 및 조회')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const port = config.get<number>('port');
  await app.listen(port);
}
bootstrap();
