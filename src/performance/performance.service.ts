// import _ from 'lodash';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';
import { PerformanceTime } from './entities/performanceTime.entity';
import { Like, FindOptionsWhere } from 'typeorm';
import { Seat } from 'src/seat/entities/seat.entity';
import { DataSource } from 'typeorm';
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
    // Transaction
    private readonly dataSource: DataSource,
  ) {}
  // 공연 생성
  async create(createPerformanceDto: CreatePerformanceDto, req: any) {
    return await this.dataSource.transaction(async (manager) => {
      // 같은 이름의 공연명이 있는지 확인
      const existedPerformance = await manager.findOne(Performance, {
        where: {
          title: createPerformanceDto.title,
        },
      });
      if (existedPerformance) {
        throw new ConflictException(
          `${createPerformanceDto.title}은 이미 만들어진 공연입니다.`,
        );
      }
      // 공연 생성
      const newPerformance = await manager.save(Performance, {
        ...createPerformanceDto,
        ownerId: req.user.id,
      });
      const newPerformanceId = newPerformance.performanceId;
      //공연 시간 생성
      const performanceList = [];
      // 공연설립자(?)는 공연을 생성할때 공연 시간을 여러개 배열로 입력받음.
      // for문으로 공연 시간 하나씩 PerformanceTime의 데이터를 생성
      for (let i = 0; i < createPerformanceDto.performanceDate.length; i++) {
        const performance = await manager.save(PerformanceTime, {
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
          await manager.save(Seat, {
            seatNumber: i + 1,
            performanceId: newPerformance.performanceId,
            performanceTimesId: performanceList[j].performanceTimesId,
          });
        }
      }
      return {
        status: 201,
        messages: '공연 생성에 성공했습니다.',
        data: {
          newPerformance,
        },
      };
    });
  }

  // 공연 전체 조회
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
    if (performanceAll.length == 0)
      throw new NotFoundException('현재 공연이 없습니다.');
    return performanceAll;
  }
  // 공연 상세 조회
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
      throw new NotFoundException('해당하는 공연이 없습니다.');
    }
    return performance;
  }
  // 공연 삭제
  async remove(id: string) {
    const existedPerformance = this.findOne(id);
    await this.performanceRepository.delete({
      performanceId: +id,
    });

    return {
      status: 200,
      messages: '삭제를 성공적으로 했습니다.',
      performanceId: (await existedPerformance).performanceId,
    };
  }
  // 공연 검색
  async search(performanceName: string) {
    const whereCondition: FindOptionsWhere<Performance> = {
      // title이 performanceName에 포함이 되는지 확인
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
    if (performances.length == 0) {
      throw new NotFoundException('해당하는 공연이 없습니다.');
    }
    return performances;
  }

  // 해당 공연 시간 검색
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
      },
    });
    if (performanceTimes.length == 0) {
      throw new NotFoundException('해당하는 공연이 없습니다.');
    }
    return performanceTimes;
  }
}
