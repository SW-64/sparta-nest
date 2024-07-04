import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IsString, IsInt } from 'class-validator';

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

  @IsInt()
  @Column('int', { nullable: true })
  isPossibleReservationCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
