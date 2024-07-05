import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entity/reservation.entity';
import { Repository } from 'typeorm';
import { ReservationOnlineDTO } from './dto/reservation-online.dto';
import { Performance } from 'src/performance/entities/performance.entity';
import { PerformanceTime } from 'src/performance/entities/performanceTime.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    //예약 Repository
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    //공연 Repository
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    //공연시간 Repository
    @InjectRepository(PerformanceTime)
    private performanceTimeRepository: Repository<PerformanceTime>,
    //좌석 Repository
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    //유저 Repository
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async reservation(
    req,
    reservationOnlineDto,
    performanceId,
    performanceTimesId,
  ) {
    const { quantity } = reservationOnlineDto;

    // 공연, 공연시간 id로 좌석을 조회했는데 나오지 않을시 False
    const seat = await this.seatRepository.find({
      where: {
        performanceId,
        performanceTimesId,
      },
    });
    if (seat.length === 0) {
      throw new Error('Not Found Seat');
    }
    // 공연의 좌석이 다 찼다면 False
    const seatCount = (
      await this.performanceTimeRepository.find({
        where: {
          performanceId,
          performanceTimesId,
        },
        select: {
          isPossibleReservationCount: true,
        },
      })
    ).map((p) => p.isPossibleReservationCount)[0];
    if (seatCount - quantity < 0) {
      throw new Error('Not Seat Found');
    }
    // 유저 돈이 없을때
    const userPoint = req.user.points;
    ///////////하나 공부해야할 표현
    const performancePrice = (
      await this.performanceRepository.find({
        where: { performanceId },
        select: {
          price: true,
        },
      })
    ).map((p) => p.price)[0];
    console.log(req.user);
    if (userPoint - performancePrice * quantity < 0)
      throw new Error('No Money');

    // 트랜잭션으로 묶기
    // 예매정보 생성
    const remainSeat = (
      await this.seatRepository.find({
        where: {
          performanceId,
          performanceTimesId,
          isPossible: true,
        },
        select: {
          seatId: true,
        },
        take: quantity,
      })
    ).map((p) => p.seatId);

    await this.reservationRepository.create({
      userId: req.user.id,
      performanceId,
      performanceTimesId,
      seatIds: remainSeat,
      quantity,
      totalPrice: performancePrice * quantity,
    });

    // 포인트 차감 ( 개수 생각 )

    const userId = req.user.id;
    const updateUserPoint = (req.user.points -= performancePrice * quantity);
    const updateData = { points: updateUserPoint };
    await this.userRepository.update(userId, updateData);

    // 좌석 차감 ( 개수 생각 )
    const seatStatus = { isPossible: false };
    for (let i = 0; i < remainSeat.length; i++) {
      await this.seatRepository.update(
        {
          performanceId,
          performanceTimesId,
          seatId: remainSeat[i],
        },
        seatStatus,
      );
    }
  }
  async reservationOnline(reservationOnlineDto: ReservationOnlineDTO) {
    // 공연, 공연시간, 좌석 id로 조회했는데 나오지 않을시 False
    // 공연의 좌석이 다 찼다면 False
    // 트랜잭션으로 묶기
    // 예매정보 생성
    // 포인트 차감 ( 개수 생각 )
    // 좌석 차감 ( 개수 생각 )
    console.log(reservationOnlineDto);
  }

  async reservationGetAll() {}
}
