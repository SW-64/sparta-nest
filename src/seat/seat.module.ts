import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { Seat } from './entities/seat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seat]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        // .env 파일에 JWT_SECRET_KEY라는 키로 비밀키를 저장해두고 사용합니다.
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SeatController],
  providers: [SeatService],
})
export class SeatModule {}
