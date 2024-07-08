import { Entity } from 'typeorm';

import {} from '../paymentStatus.enum';
import { IsInt } from 'class-validator';
import { Reservation } from '../entity/reservation.entity';
import { PickType } from '@nestjs/mapped-types';
@Entity({
  name: 'reservations',
})
export class ReservationOnlineDTO extends PickType(Reservation, [
  'quantity',

  ,
] as const) {
  // @IsInt()
  // readonly seatId: number;

  @IsInt()
  readonly quantity: number;

  // @IsInt()
  // readonly totalPrice: number;

  // @IsEnum(paymentStatus)
  // readonly paymentStatus: paymentStatus;

  // @IsString()
  // readonly reservationDate: string;
}
