import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { paymentStatus } from '../paymentStatus.enum';
import { IsEnum, IsInt, IsArray } from 'class-validator';

@Entity({
  name: 'reservations',
})
export class Reservation {
  @PrimaryGeneratedColumn()
  reservationId: number;

  @IsInt()
  @Column({ type: 'int', nullable: false })
  userId: number;

  @IsInt()
  @Column({ type: 'int', nullable: false })
  performanceId: number;

  @IsInt()
  @Column({ type: 'int', nullable: false })
  performanceTimesId: number;

  @IsArray()
  @Column('simple-array', { nullable: false })
  seatIds: number[];

  @IsInt()
  @Column({ type: 'int', nullable: false })
  quantity: number;

  @IsInt()
  @Column({ type: 'int', nullable: false })
  totalPrice: number;

  @IsEnum(paymentStatus)
  @Column({
    type: 'enum',
    enum: paymentStatus,
    default: paymentStatus.PAYMENT_BEFORE,
    nullable: false,
  })
  paymentStatus: paymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  /*
  @OneToOne(() => User, (user) => user.reservation)
  @JoinColumn({ name: 'userId' })
  user: User;


  @OneToOne(() => Performance, (performance) => performance.reservation)
  @JoinColumn({ name: 'performanceId' })
  performance: Performance;

  @OneToOne(
    () => PerformanceTime,
    (performanceTimesId) => performanceTimesId.reservation,
  )
  @JoinColumn({ name: 'performanceTimesId' })
  performanceTime: PerformanceTime;
    */
}
