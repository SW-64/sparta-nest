import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Performance } from './entities/performance.entity';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { PerformanceTime } from './entities/performanceTime.entity';
import { Seat } from 'src/seat/entities/seat.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Performance, PerformanceTime, Seat]), // 이건 TypeORM 강의 시간에 배웠죠?
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        // .env 파일에 JWT_SECRET_KEY라는 키로 비밀키를 저장해두고 사용합니다.
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService],
})
export class PerformanceModule {}
