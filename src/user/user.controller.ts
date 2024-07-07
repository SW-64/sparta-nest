import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // 내 정보 조회
  @Get('/me')
  getMyInfo(@Req() req: any) {
    console.log(req.user);
    return this.userService.getMyInfo(req);
  }
}
