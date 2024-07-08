import { Injectable, NotFoundException } from '@nestjs/common';
import { Seat } from './entities/seat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}
  // 해당 공연 및 공연시간에 대한 좌석 전체 조회
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
    if (seatAll.length == 0)
      throw new NotFoundException('해당 공연시간에 대한 좌석이 없습니다.');
    return seatAll;
  }
  // 해당 공연 및 공연시간에 대한 좌석 상세 조회
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
    if (!seatOne)
      throw new NotFoundException(
        '해당 공연시간 및 좌석번호에 대한 좌석이 없습니다.',
      );
    return seatOne;
  }
}
