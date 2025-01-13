import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization } from '../../common/decorators/auth.decorator';
import { Authorized } from '../../common/decorators/authorized.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findProfile(@Authorized('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Authorization(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  public async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // @Authorization()
  // @HttpCode(HttpStatus.OK)
  // @Patch("profile")
  // public async updateProfile(
  //   @Authorized("id") userId: string,
  //   @Body() dto: UpdateUserDto,
  // ) {
  //   return this.userService.update(userId, dto);
  // }
}
