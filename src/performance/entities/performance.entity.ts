import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsString, IsInt, IsArray } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

import { PerformanceTime } from './performanceTime.entity';
import { Seat } from 'src/seat/entities/seat.entity';
@Entity({
  name: 'performances',
})
export class Performance {
  @PrimaryGeneratedColumn('increment')
  performanceId: number;

  @Column('int', { nullable: false })
  ownerId: number;

  @IsString()
  @Column('varchar', { nullable: false })
  title: string;

  @IsString()
  @Column('varchar', { nullable: false })
  description: string;

  @IsString()
  @Column('varchar', { nullable: false })
  category: string;

  @IsString()
  @Column('varchar', { nullable: false })
  place: string;

  @IsInt()
  @Column('int', { nullable: false })
  price: number;

  @IsString()
  @Column('varchar', { nullable: true })
  performanceImage: string;

  @IsInt()
  @Column('int', { nullable: false })
  seatCount: number;

  @IsArray()
  @Column('simple-array', { nullable: false })
  performanceDate: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.ownedPerformances)
  @JoinColumn({ name: 'ownerId' })
  user: User;
  /*
  @OneToOne(() => Reservation, (reservation) => reservation.performance)
  reservation: Reservation;
  */
  @OneToMany(
    () => PerformanceTime,
    (performanceTime) => performanceTime.performance,
  )
  performanceTime: PerformanceTime[];

  @OneToMany(() => Seat, (seat) => seat.performance)
  seat: Seat;
}
