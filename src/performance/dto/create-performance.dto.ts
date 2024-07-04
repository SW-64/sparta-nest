import { Performance } from '../entities/performance.entity';
import { PickType } from '@nestjs/mapped-types';
import { IsString, IsInt, IsArray } from 'class-validator';
export class CreatePerformanceDto extends PickType(Performance, [
  'title',
  'description',
  'category',
  'place',
  'price',
  'performanceImage',
  'seatCount',
  'performanceDate',
] as const) {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly category: string;

  @IsString()
  readonly place: string;

  @IsInt()
  readonly price: number;

  @IsString()
  readonly performanceImage: string;

  @IsInt()
  readonly seatCount: number;

  @IsArray()
  readonly performanceDate: string[];
}
