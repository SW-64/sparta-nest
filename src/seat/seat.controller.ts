import { Controller, Get, Param } from '@nestjs/common';
import { SeatService } from './seat.service';

@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}
  // 해당 공연 및 공연시간에 대한 좌석 전체 조회
  @Get('/:performanceId/:performanceTimesId')
  findAll(
    @Param('performanceId') performanceId: number,
    @Param('performanceTimesId') performanceTimesId: number,
  ) {
    return this.seatService.findAll(performanceId, performanceTimesId);
  }
  // 해당 공연 및 공연시간에 대한 좌석 상세 조회
  @Get('/:performanceId/:performanceTimesId/:seatNumber')
  findOne(
    @Param('performanceId') performanceId: number,
    @Param('performanceTimesId') performanceTimesId: number,
    @Param('seatNumber') seatNumber: number,
  ) {
    return this.seatService.findOne(
      performanceId,
      performanceTimesId,
      seatNumber,
    );
  }
}
