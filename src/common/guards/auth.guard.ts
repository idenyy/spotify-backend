import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('No refresh token provided');

    let payload: any;
    try {
      payload = jwt.verify(refreshToken, this.configService.getOrThrow<string>('JWT_SECRET'));
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.userService.findById(payload.id);
    if (!user) throw new UnauthorizedException('User not found');

    request.user = user;
    return true;
  }
}
