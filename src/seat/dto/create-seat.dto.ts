import { Seat } from '../entities/seat.entity';
import { PickType } from '@nestjs/mapped-types';
import { IsInt } from 'class-validator';
export class CreateSeatDto extends PickType(Seat, ['seatNumber'] as const) {
  @IsInt()
  readonly seatNumber: number;
}
