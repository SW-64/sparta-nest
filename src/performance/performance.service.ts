import _ from 'lodash';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from './entities/performance.entity';
import { PerformanceTime } from './entities/performanceTime.entity';
import { Like, FindOptionsWhere } from 'typeorm';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    @InjectRepository(PerformanceTime)
    private performanceTimeRepository: Repository<PerformanceTime>,
  ) {}
  async create(createPerformanceDto: CreatePerformanceDto) {
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

    const newPerformance =
      await this.performanceRepository.save(createPerformanceDto);
    const newPerformanceId = newPerformance.performanceId;

    const performanceList = [];
    for (let i = 0; i < createPerformanceDto.performanceDate.length; i++) {
      const performance = await this.performanceTimeRepository.save({
        performanceId: newPerformanceId,
        performanceDate: createPerformanceDto.performanceDate[i],
      });
      performanceList.push(performance);
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

  findAll() {
    return this.performanceRepository.find();
  }

  async findOne(id: string) {
    const performance = await this.performanceRepository.findOne({
      where: { performanceId: +id },
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
    console.log('hello');
    const whereCondition: FindOptionsWhere<Performance> = {
      title: Like(`%${performanceName}%`),
    };

    const performances = await this.performanceRepository.find({
      where: whereCondition,
    });
    return performances;
  }

  async findTimeAll(performanceId) {
    const performanceTimes = await this.performanceTimeRepository.find({
      where: { performanceId: +performanceId },
    });
    return performanceTimes;
  }
}
