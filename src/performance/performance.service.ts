// import _ from 'lodash';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';
import { PerformanceTime } from './entities/performanceTime.entity';
import { Like, FindOptionsWhere } from 'typeorm';
import { Seat } from 'src/seat/entities/seat.entity';
@Injectable()
export class PerformanceService {
  constructor(
    // 공연 데이터
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    // 공연시간 데이터
    @InjectRepository(PerformanceTime)
    private performanceTimeRepository: Repository<PerformanceTime>,
    // 좌석 데이터
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}
  async create(createPerformanceDto: CreatePerformanceDto, req: any) {
    const existedPerformance = await this.performanceRepository.findOne({
      where: {
        title: createPerformanceDto.title,
      },
    });

    if (existedPerformance) {
      throw new ConflictException(
        `${createPerformanceDto.title}은 이미 만들어진 공연입니다.`,
      );
    }
    const newPerformance = await this.performanceRepository.save({
      ...createPerformanceDto,
      ownerId: req.user.id,
    });
    const newPerformanceId = newPerformance.performanceId;
    console.log(newPerformance);
    //공연 시간 생성
    const performanceList = [];
    for (let i = 0; i < createPerformanceDto.performanceDate.length; i++) {
      const performance = await this.performanceTimeRepository.save({
        performanceId: newPerformanceId,
        performanceDate: createPerformanceDto.performanceDate[i],
        isPossibleReservationCount: newPerformance.seatCount,
      });
      performanceList.push(performance);
    }
    // 공연 좌석 생성 ( 미리 전체 좌석 데이터 생성 or 예매한 좌석만 생성?)
    // 일단 ' 해당 좌석에 예매가 되어있는지 ' 확인하기 위해 전자를 택함

    for (let j = 0; j < performanceList.length; j++) {
      // 공연시간별로 생성
      for (let i = 0; i < newPerformance.seatCount; i++) {
        //좌석별로 데이터 생성
        const seat = await this.seatRepository.save({
          seatNumber: i + 1,
          performanceId: newPerformance.performanceId,
          performanceTimesId: performanceList[j].performanceTimesId,
        });
        console.log(seat);
      }
    }
    return {
      status: 201,
      messages: '공연 생성에 성공했습니다.',
      data: {
        newPerformance,
        performanceList,
      },
    };
  }

  async findAll() {
    const performanceAll = await this.performanceRepository.find({
      select: [
        'performanceId',
        'ownerId',
        'title',
        'category',
        'performanceImage',
        'performanceDate',
      ],
    });
    return performanceAll;
  }

  async findOne(id: string) {
    const performance = await this.performanceRepository.findOne({
      where: { performanceId: +id },
      select: [
        'performanceId',
        'ownerId',
        'title',
        'description',
        'category',
        'place',
        'price',
        'performanceImage',
        'seatCount',
        'performanceDate',
      ],
    });
    if (!performance) {
      throw new ConflictException('해당하는 공연이 없습니다.');
    }
    return performance;
  }

  //TypeORM의 remove() 메서드 사용 방법
  async remove(id: string) {
    const performance = await this.performanceRepository.delete({
      performanceId: +id,
    });
    if (!performance) {
      throw new ConflictException('해당하는 공연이 없습니다.');
    }
    return performance;
  }

  async search(performanceName: string) {
    const whereCondition: FindOptionsWhere<Performance> = {
      title: Like(`%${performanceName}%`),
    };

    const performances = await this.performanceRepository.find({
      where: whereCondition,
      select: [
        'performanceId',
        'ownerId',
        'title',
        'description',
        'category',
        'place',
        'price',
        'performanceImage',
        'seatCount',
        'performanceDate',
      ],
    });
    return performances;
  }

  async findTimeAll(performanceId) {
    const performanceTimes = await this.performanceTimeRepository.find({
      relations: {
        performance: true,
      },
      where: { performanceId: +performanceId },
      select: {
        performanceId: true,
        performanceTimesId: true,
        performance: {
          title: true,
        },
        performanceDate: true,
        isPossibleReservation: true,
        isPossibleReservationCount: true,
        /*
        'performanceTimesId',
        'performanceId',
        'performanceDate',
        'isPossibleReservation',
        'isPossibleReservationCount',
        */
      },
    });
    return performanceTimes;
  }
}
