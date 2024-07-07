import { IsEmail, IsEnum, IsInt, IsString, Length } from 'class-validator';
import { userType } from '../userType.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Performance } from 'src/performance/entities/performance.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsString()
  @IsEmail()
  @Column('varchar', { nullable: false })
  email: string;

  @IsString()
  @Length(5, 10) // 5~10 길이
  @Column('varchar', { select: false, nullable: false })
  password: string;

  @IsString()
  @Length(2, 8) // 2~8 길이
  @Column('varchar', { nullable: false })
  nickname: string;

  @IsEnum(userType)
  @Column({ type: 'enum', enum: userType, nullable: false })
  userType: userType;

  @IsInt() // 기본값 :  100만 포인트
  @Column('int', { default: 1000000, nullable: false })
  points: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Performance, (performance) => performance.user)
  ownedPerformances: Performance[];

  /*
  @OneToOne(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation;
  */
}
