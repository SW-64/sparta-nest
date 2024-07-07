// import { Role } from 'src/user/types/userRole.type';
import { userType } from 'src/user/userType.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserTypeGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const authenticated = await super.canActivate(context);
    console.log(authenticated);
    if (!authenticated) {
      return false;
    }

    // 서버가 원하는 조건 =>
    const requiredUserTypes = this.reflector.getAllAndOverride<userType[]>(
      'userTypes',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredUserTypes) {
      return true;
    }
    //여기서 user 정보를 출력하면 email만 출력
    const { user } = context.switchToHttp().getRequest();

    console.log('zz');
    console.log(user);
    console.log(
      requiredUserTypes.some((userType) => user.userType === userType),
    );
    return requiredUserTypes.some((userType) => user.userType === userType);
  }
}
