import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class AuthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  public async server() {
    return 'Sever is working...';
  }
}
