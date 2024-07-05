import { Controller, Get, Param } from '@nestjs/common';
import { SeatService } from './seat.service';

@Controller('seat')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Get('/:performanceId/:performanceTimesId')
  findAll(
    @Param('performanceId') performanceId: number,
    @Param('performanceTimesId') performanceTimesId: number,
  ) {
    return this.seatService.findAll(performanceId, performanceTimesId);
  }

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
