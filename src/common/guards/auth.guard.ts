import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log('Request user from auth guard: ', request.user);
    if (typeof request.user.id === 'undefined')
      throw new UnauthorizedException(
        'You are not authorized to access this resource. Please log in',
      );

    const user = await this.userService.findById(request.user.id);
    console.log('User from auth guard: ', user);

    request.user = user;

    return true;
  }
}
