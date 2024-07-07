import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 로그인
  @Post('/sign-in')
  async login(@Body() loginUserDTO: LoginUserDto) {
    return await this.authService.login(loginUserDTO);
  }

  // 회원가입
  @Post('/sign-up')
  async createUser(@Body() createUserDTO: CreateUserDto) {
    return await this.authService.create(createUserDTO);
  }
}
