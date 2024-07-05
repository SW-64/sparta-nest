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
import { UserTypes } from 'src/auth/user.decorator';
import { userType } from 'src/auth/userType.enum';

@UseGuards(UserTypeGuard)
@Controller('performances')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @UserTypes(userType.OWNER)
  @Post()
  create(@Body() createPerformanceDto: CreatePerformanceDto, @Req() req: any) {
    return this.performanceService.create(createPerformanceDto, req);
  }
  @Get()
  findAll() {
    return this.performanceService.findAll();
  }

  //search와 :id의 순서도 중요한건가?
  @Get('search')
  search(@Query('performanceName') performanceName: string) {
    return this.performanceService.search(performanceName);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.performanceService.findOne(id);
  }

  @UserTypes(userType.OWNER)
  @Delete(':id')
  @UseGuards(UserTypeGuard)
  remove(@Param('id') id: string) {
    return this.performanceService.remove(id);
  }

  @Get('/:performanceId/performanceTimes')
  findTimeAll(@Param('performanceId') performanceId: string) {
    return this.performanceService.findTimeAll(performanceId);
  }
}
