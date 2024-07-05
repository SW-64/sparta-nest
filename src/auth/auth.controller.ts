import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async login(@Body() loginUserDTO: LoginUserDto) {
    return await this.authService.login(loginUserDTO);
  }

  @Post('/sign-up')
  async createUser(@Body() createUserDTO: CreateUserDto) {
    return await this.authService.create(createUserDTO);
  }

  /*
  @Get('/check')
  checkUser(@Req() req: any) {
    return this.authService.checkUser();
  }
  */
}
