import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { UserTypeGuard } from 'src/level/level.guard';

@UseGuards(UserTypeGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // 내 정보 조회
  @Get('/me')
  getMyInfo(@Req() req: any) {
    return this.userService.getMyInfo(req);
  }
}
