import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UserTypeGuard } from 'src/level/level.guard';
import { UserTypes } from 'src/user/decoraters/user.decorator';
import { userType } from 'src/user/userType.enum';

@UseGuards(UserTypeGuard) // 인증
@Controller('performances')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  // 공연 생성
  @UserTypes(userType.OWNER) // OWNER만 가능 => 인가
  @Post()
  create(@Body() createPerformanceDto: CreatePerformanceDto, @Req() req: any) {
    console.log(req.user);
    return this.performanceService.create(createPerformanceDto, req);
  }

  // 공연 전체 조회
  @Get()
  findAll() {
    return this.performanceService.findAll();
  }

  // 공연 검색
  @Get('search')
  search(@Query('performanceName') performanceName: string) {
    return this.performanceService.search(performanceName);
  }

  // 공연 상세 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.performanceService.findOne(id);
  }

  // 공연 삭제
  @UserTypes(userType.OWNER) //OWNER만 가능 => 인가
  @Delete(':id')
  @UseGuards(UserTypeGuard)
  remove(@Param('id') id: string) {
    return this.performanceService.remove(id);
  }

  // 해당 공연 시간 조회
  @Get('/:performanceId/performanceTimes')
  findTimeAll(@Param('performanceId') performanceId: string) {
    return this.performanceService.findTimeAll(performanceId);
  }
}
