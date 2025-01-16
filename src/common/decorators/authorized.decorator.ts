import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '@/common/interfaces/user.interface';

export const Authorized = createParamDecorator((data: keyof IUser, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user = request.user;

  return data ? user[data] : user;
});
