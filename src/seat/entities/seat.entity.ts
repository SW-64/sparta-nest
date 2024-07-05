import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Performance } from 'src/performance/entities/performance.entity';
import { IsBoolean, IsInt } from 'class-validator';
@Entity({
  name: 'seat',
})
export class Seat {
  @PrimaryGeneratedColumn('increment')
  seatId: number;

  @IsInt()
  @Column('int', { nullable: false })
  seatNumber: number;

  @IsInt()
  @Column('varchar', { nullable: false })
  performanceId: number;

  @IsInt()
  @Column('int', { nullable: false })
  performanceTimesId: number;

  @IsBoolean()
  @Column('bool', { default: true, nullable: false })
  isPossible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Performance, (performance) => performance.seat)
  @JoinColumn({ name: 'ownerId' })
  performance: Performance;
}
