import { PickType } from '@nestjs/mapped-types';
import { IsString, IsEmail, Length, IsEnum } from 'class-validator';
import { User } from '../entities/user.entity';
import { userType } from '../userType.enum';
export class CreateUserDto extends PickType(User, [
  'email',
  'password',
  'nickname',
  'userType',
] as const) {
  @IsString()
  @IsEmail()
  readonly email: string;
  @IsString()
  @Length(5, 10)
  readonly password: string;
  @IsString()
  @Length(2, 8)
  readonly nickname: string;
  @IsString()
  @IsEnum(userType)
  readonly userType: userType;
}
