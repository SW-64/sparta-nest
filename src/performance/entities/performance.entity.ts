import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsString, IsInt, IsBoolean, IsArray } from 'class-validator';
import { User } from 'src/auth/user.entity';
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
  @Column('varchar', { nullable: false })
  price: number;

  @IsString()
  @Column('varchar', { nullable: true })
  performanceImage: string;

  @IsInt()
  @Column('int', { nullable: false })
  seatCount: number;

  @IsBoolean()
  @Column('bool', { default: true })
  isPossibleReservation: boolean;

  @IsArray()
  @Column('simple-array', { nullable: false })
  performanceDate: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.performances)
  user: User;
}
