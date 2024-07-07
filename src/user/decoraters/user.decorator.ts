import { userType } from '../userType.enum';
import { SetMetadata } from '@nestjs/common';

export const UserTypes = (...userTypes: userType[]) =>
  SetMetadata('userTypes', userTypes);
