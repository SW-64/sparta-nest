import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { paymentStatus } from '../paymentStatus.enum';
import { IsEnum, IsInt } from 'class-validator';
import { User } from 'src/auth/entity/user.entity';
import { Performance } from 'src/performance/entities/performance.entity';
import { PerformanceTime } from 'src/performance/entities/performanceTime.entity';
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

  @IsInt({ each: true })
  @Column('int', { array: true, nullable: false })
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
}
