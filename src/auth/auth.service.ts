import _ from 'lodash';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService, // JWT 토큰 생성을 위해 주입한 서비스
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email, deletedAt: null },
      select: ['id', 'password', 'email', 'nickname', 'userType', 'points'],
    });

    if (_.isNil(user)) {
      throw new NotFoundException(`유저를 찾을 수 없습니다. ID: ${email}`);
    }

    if (user.password !== password) {
      throw new UnauthorizedException(
        `유저의 비밀번호가 올바르지 않습니다. ID: ${email}`,
      );
    }

    // 추가된 코드 - JWT 토큰 생성
    const payload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      userType: user.userType,
      points: user.points,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const userInfo = await this.userRepository.find({
      where: { id: payload.id },
    });
    return {
      status: 200,
      messages: '로그인에 성공했습니다.',
      data: {
        userInfo,
      },
      accessToken: accessToken,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.findOne(createUserDto.email);
    if (!_.isNil(existUser)) {
      throw new ConflictException(
        `이미 가입된 ID입니다. ID: ${createUserDto.email}`,
      );
    }

    const newUser = await this.userRepository.save(createUserDto);

    return {
      status: 201,
      message: '회원가입이 성공적으로 완료했습니다.',
      data: { newUser },
    };
  }

  // checkUser(req: any) {

  //   return userInfo
  // }

  private async findOne(email: string) {
    return await this.userRepository.findOne({
      where: { email, deletedAt: null },
      select: ['email', 'createdAt', 'updatedAt'],
    });
  }
  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
