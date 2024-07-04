// import { Role } from 'src/user/types/userRole.type';
import { userType } from 'src/auth/userType.enum';
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

    const requiredUserTypes = this.reflector.getAllAndOverride<userType[]>(
      'userTypes',
      [context.getHandler(), context.getClass()],
    );
    console.log(requiredUserTypes);
    if (!requiredUserTypes) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log(user);
    console.log(
      requiredUserTypes.some((userType) => user.userType === userType),
    );
    return requiredUserTypes.some((userType) => user.userType === userType);
  }
}
