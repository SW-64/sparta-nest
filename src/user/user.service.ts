import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  // 내 정보 조회
  async getMyInfo(req) {
    console.log(req.user);
    const userInfo = await this.userRepository.findOne({});

    return userInfo;
  }
}
