import { Injectable } from '@nestjs/common';
import { Seat } from './entities/seat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}

  async findAll(performanceId, performanceTimesId) {
    const seatAll = await this.seatRepository.find({
      where: {
        performanceId,
        performanceTimesId,
      },
      select: [
        'seatNumber',
        'performanceId',
        'performanceTimesId',
        'isPossible',
      ],
    });
    return seatAll;
  }

  async findOne(performanceId, performanceTimesId, seatNumber) {
    const seatOne = await this.seatRepository.findOne({
      where: {
        performanceId,
        performanceTimesId,
        seatNumber,
      },
      select: {
        seatNumber: true,
        performanceId: true,
        performanceTimesId: true,
        isPossible: true,
      },
    });
    console.log(seatOne);
    return seatOne;
  }
}
