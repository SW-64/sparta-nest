import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() {}
  // 내 정보 조회
  async getMyInfo(req) {
    // req.user와 userRepository 둘 중에 어느걸 써야 더 효율적일까?
    // const userInfo = await this.userRepository.findOne({});
    return req.user;
  }
}
