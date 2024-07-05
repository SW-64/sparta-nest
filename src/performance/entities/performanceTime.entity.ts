import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { IsString, IsInt, IsBoolean } from 'class-validator';
import { Performance } from './performance.entity';
import { Reservation } from 'src/reservation/entity/reservation.entity';
@Entity({
  name: 'performancesTime',
})
export class PerformanceTime {
  @PrimaryGeneratedColumn('increment')
  performanceTimesId: number;

  @Column('int', { nullable: false })
  performanceId: number;

  @IsString()
  @Column('varchar', { nullable: false })
  performanceDate: string;

  @IsBoolean()
  @Column('bool', { default: true })
  isPossibleReservation: boolean;

  @IsInt()
  @Column('int', { nullable: false })
  isPossibleReservationCount: number; // default값으로 다른 엔티티의 값을 불러올수있나

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Performance, (performance) => performance.performanceTime)
  @JoinColumn({ name: 'performanceId' })
  performance: Performance;

  @OneToOne(() => Reservation, (reservation) => reservation.performanceTime)
  reservation: Reservation;
}
