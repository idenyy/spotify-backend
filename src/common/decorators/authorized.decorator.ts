import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { User } from '@/common/schemas/user.schema';

export const Authorized = createParamDecorator((data: keyof User, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user = request.user;

  if (!user) throw new UnauthorizedException('User is not authenticated');

  return data ? user[data] : user;
});
