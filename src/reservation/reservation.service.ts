import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entity/reservation.entity';
import { Repository } from 'typeorm';
import { Performance } from 'src/performance/entities/performance.entity';
import { PerformanceTime } from 'src/performance/entities/performanceTime.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { paymentStatus } from './paymentStatus.enum';
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
    // Transaction
    private readonly dataSource: DataSource,
  ) {}

  // 좌석 지정하지 않고 예매
  async reservation(
    req,
    reservationOnlineDto,
    performanceId,
    performanceTimesId,
  ) {
    const { quantity } = reservationOnlineDto;
    return await this.dataSource.transaction(async (manager) => {
      // 예외성 처리
      // 1. 공연, 공연시간 id로 좌석을 조회했는데 나오지 않을시 False
      const seat = await manager.find(Seat, {
        where: {
          performanceId,
          performanceTimesId,
        },
      });
      if (seat.length === 0) {
        throw new NotFoundException('공연 좌석을 찾지 못했습니다.');
      }

      // 2. 공연의 좌석이 예약좌석 수보다 적을시 False
      const seatCount = (
        await manager.find(PerformanceTime, {
          // 해당 공연과 공연시간에 맞는 공연시간 데이터를 가져옴
          where: {
            performanceId,
            performanceTimesId,
          },
          // 공연시간 데이터의 예매 가능한 좌석 수 조회
          select: {
            isPossibleReservationCount: true,
          },
        })
      ).map((p) => p.isPossibleReservationCount)[0];

      // 예약 가능한 좌석수가 '예매하려는 좌석 수'보다 적을 시 False
      if (seatCount - quantity < 0) {
        throw new ConflictException(
          '공연 좌석이 예매하려는 좌석보다 적습니다.',
        );
      }

      // 3. 유저 돈이 없을때
      const userPoint = req.user.points;
      // 공연 테이블을 조회해 그 공연의 가격을 추출
      const performancePrice = (
        await manager.find(Performance, {
          where: { performanceId },
          select: {
            price: true,
          },
        })
      ).map((p) => p.price)[0];
      // 만약 유저의 포인트가 공연 가격 X 개수 보다 적을시 False
      if (userPoint - performancePrice * quantity < 0)
        throw new BadRequestException('유저의 포인트가 부족합니다.');

      // 예외성 처리 끝.
      // ( 예매정보, 포인트, 좌석 개수 )트랜잭션으로 묶기
      // 1. 예매정보 생성
      const remainSeat = (
        await manager.find(Seat, {
          // 해당 공연, 공연시간, 그리고 예매 가능한 좌석을 조회
          where: {
            performanceId,
            performanceTimesId,
            isPossible: true,
          },
          // 유저는 좌석을 고르지 않았으니, seatId를 추출함으로써 좌석을 부여
          select: {
            seatId: true,
          },
          take: quantity,
        })
      ).map((p) => p.seatId);
      // map을 사용하는 이유 => 아래와 같이 추출된다. 나는 조금 더 명확한 값을 얻고자..
      //[ Seat { seatId: 293 } ]
      // 예매 테이블에 데이터 생성
      await manager.create(Reservation, {
        userId: req.user.id,
        performanceId,
        performanceTimesId,
        seatIds: remainSeat,
        quantity,
        totalPrice: performancePrice * quantity,
      });

      // 2. 포인트 차감
      // userId = 조건
      const userId = req.user.id;
      const updateUserPoint = (req.user.points -= performancePrice * quantity);
      // updateData = 수정할 데이터 생성
      const updateData = { points: updateUserPoint };
      // 데이터 수정
      await manager.update(User, userId, updateData);

      // 3. 좌석테이블 -> 좌석 상태 변경
      // seatStatus = 수정할 데이터 생성
      const seatStatus = { isPossible: false };
      for (let i = 0; i < remainSeat.length; i++) {
        await manager.update(
          Seat,
          // 조건
          {
            performanceId,
            performanceTimesId,
            seatId: remainSeat[i],
          },
          seatStatus,
        );
      }

      // 4. 공연 시간 테이블 -> 좌석 개수 차감
      // 공연시간 테이블로부터, 예매 가능한 좌석 개수 추출
      const reservationInfo = await manager.find(PerformanceTime, {
        where: {
          performanceId,
          performanceTimesId,
        },
        select: {
          isPossibleReservationCount: true,
        },
      });
      const { isPossibleReservationCount } = reservationInfo[0];
      // 만약 가능한 공연 좌석개수가 0이라면 예약가능한지 여부에 대한 값 false로 변경
      let possibleReservation: boolean;
      if (isPossibleReservationCount - quantity == 0)
        possibleReservation = false;
      // 수정할 데이터
      const performanceTimeUpdateData = {
        // 가능한 좌석 개수 차감
        isPossibleReservationCount: isPossibleReservationCount - quantity,
        // 가능한 좌석 개수가 0이라면 False 반환
        isPossibleReservation: possibleReservation,
      };
      await manager.update(
        PerformanceTime,
        {
          performanceId,
          performanceTimesId,
        },
        performanceTimeUpdateData,
      );
      // 5. 예매 상태 변경
      const reservationStatus = {
        paymentStatus: paymentStatus.PAYMENT_COMPLETED,
      };
      await manager.update(
        Reservation,
        {
          performanceId,
          performanceTimesId,
          userId,
        },
        reservationStatus,
      );
      return {
        messages: '예약이 성공적으로 완료되었습니다.',
      };
    });
  }

  //좌석 지정하는 예매
  async reservationOnline(
    req,
    reservationOnlineDto,
    performanceId,
    performanceTimesId,
  ) {
    // 예매 개수와 예매 번호를 입력받음
    const { quantity, seatNumber } = reservationOnlineDto;
    return await this.dataSource.transaction(async (manager) => {
      // 예외성 처리
      // 1. 예매 개수와 예매 번호의 개수가 같지않을때
      if (quantity != seatNumber.length)
        throw new BadRequestException(
          '예매 하려는 좌석의 수와 예매 번호의 수가 일치하지 않습니다.',
        );

      // 2. 공연, 공연시간 좌석id로 좌석을 조회했는데 나오지 않을시 False
      for (let i = 0; i < seatNumber.length; i++) {
        const seat = await manager.find(Seat, {
          where: {
            performanceId,
            performanceTimesId,
            seatNumber: seatNumber[i],
            isPossible: true,
          },
        });
        if (seat.length == 0)
          throw new NotFoundException('해당 좌석이 없습니다.');
      }

      // 3.  공연의 좌석이 예약좌석 수보다 적을시 False
      const seatCount = (
        await manager.find(PerformanceTime, {
          // 해당 공연과 공연시간에 맞는 공연시간 데이터를 가져옴
          where: {
            performanceId,
            performanceTimesId,
          },
          // 공연시간 데이터의 예매 가능한 좌석 수 조회
          select: {
            isPossibleReservationCount: true,
          },
        })
      ).map((p) => p.isPossibleReservationCount)[0];

      // 예약 가능한 좌석수가 '예약하려는 좌석 수'보다 적을 시 False
      if (seatCount - quantity < 0) {
        throw new NotFoundException('해당 좌석이 없습니다.');
      }
      // 4. 유저 돈이 없을때
      const userPoint = req.user.points;
      // 공연 테이블을 조회해 그 공연의 가격을 추출
      const performancePrice = (
        await manager.find(Performance, {
          where: { performanceId },
          select: {
            price: true,
          },
        })
      ).map((p) => p.price)[0];
      // 만약 유저의 포인트가 공연 가격 X 개수 보다 적을시 False
      if (userPoint - performancePrice * quantity < 0)
        throw new BadRequestException('유저의 포인트가 부족합니다.');

      // 예외성 처리 끝.
      // ( 예매정보, 포인트, 좌석 개수 )트랜잭션으로 묶기
      // 1. 예매정보 생성
      await manager.create(Reservation, {
        userId: req.user.id,
        performanceId,
        performanceTimesId,
        seatNumber: seatNumber,
        quantity,
        totalPrice: performancePrice * quantity,
      });

      // 2. 포인트 차감
      // userId = 조건
      const userId = req.user.id;
      const updateUserPoint = (req.user.points -= performancePrice * quantity);
      // updateData = 수정할 데이터 생성
      const updateData = { points: updateUserPoint };
      // 데이터 수정
      await manager.update(User, userId, updateData);

      // 3. 좌석테이블 -> 좌석 상태 변경
      // seatStatus = 수정할 데이터 생성
      const seatStatus = { isPossible: false };
      for (let i = 0; i < seatNumber.length; i++) {
        await manager.update(
          Seat,
          // 조건
          {
            performanceId,
            performanceTimesId,
            seatNumber: seatNumber[i],
          },
          seatStatus,
        );
      }

      // 4. 공연 시간 테이블 -> 좌석 개수 차감
      // 공연시간 테이블로부터, 예매 가능한 좌석 개수 추출
      const reservationInfo = await manager.find(PerformanceTime, {
        where: {
          performanceId,
          performanceTimesId,
        },
        select: {
          isPossibleReservationCount: true,
        },
      });
      const { isPossibleReservationCount } = reservationInfo[0];
      // 만약 가능한 공연 좌석개수가 0이라면 예약가능한지 여부에 대한 값 false로 변경
      let possibleReservation: boolean;
      if (isPossibleReservationCount - quantity == 0)
        possibleReservation = false;
      // 수정할 데이터
      const performanceTimeUpdateData = {
        // 가능한 좌석 개수 차감
        isPossibleReservationCount: isPossibleReservationCount - quantity,
        // 가능한 좌석 개수가 0이라면 False 반환
        isPossibleReservation: possibleReservation,
      };

      await manager.update(
        PerformanceTime,
        {
          performanceId,
          performanceTimesId,
        },
        performanceTimeUpdateData,
      );
      // 5. 예매 상태 변경
      const reservationStatus = {
        paymentStatus: paymentStatus.PAYMENT_COMPLETED,
      };
      await manager.update(
        Reservation,
        {
          performanceId,
          performanceTimesId,
          userId,
        },
        reservationStatus,
      );
      return {
        messages: '예약이 성공적으로 완료되었습니다.',
      };
    });
  }
  // 예매 목록 확인
  async reservationGetAll() {}
}
