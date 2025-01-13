import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'argon2';
import { AuthMethod } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });
  }

  public async create(
    name: string,
    email: string,
    password: string,
    picture: string,
    method: AuthMethod,
    isVerified: boolean,
  ) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new ConflictException(`User with email ${email} already exists`);

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: password ? await hash(password) : '',
        picture,
        method,
        isVerified,
      },
      include: {
        accounts: true,
      },
    });

    return user;
  }
}
