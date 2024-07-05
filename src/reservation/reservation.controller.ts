import { Controller } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationOnlineDTO } from './dto/reservation-online.dto';
import { Post, Body, Param, Req } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { UserTypeGuard } from 'src/level/level.guard';
@UseGuards(UserTypeGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('/:performanceId/:performanceTimesId')
  reservation(
    @Req() req: any,
    @Body() reservationOnlineDto: ReservationOnlineDTO,
    @Param('performanceId') performanceId: number,
    @Param('performanceTimesId') performanceTimesId: number,
  ) {
    return this.reservationService.reservation(
      req,
      reservationOnlineDto,
      performanceId,
      performanceTimesId,
    );
  }

  @Post()
  reservationOnline(@Body() reservationOnlineDto: ReservationOnlineDTO) {
    return this.reservationService.reservationOnline(reservationOnlineDto);
  }

  @Get()
  reservationGetAll() {
    return this.reservationService.reservationGetAll();
  }
}
