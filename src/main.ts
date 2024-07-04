import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
// 유효성 검사 -> 정의되지 않는 데이터 필드를 전달할때 사용

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // -> 여기서 AppModule로 이동

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
