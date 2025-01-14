import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { MailService } from '@/common/libs/mail/mail.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { ConfirmationDto } from './dto/email-confirm.dto';
import { AuthMethod, TokenType } from '@prisma/__generated__';
import { hash } from 'argon2';

@Injectable()
export class EmailConfirmService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async sendVerificationToken(userData: { name: string; email: string; password: string }) {
    const token = await this.generateVerificationToken(userData);

    await this.mailService.sendConfirmationEmail(userData.name, userData.email, token);

    return true;
  }

  public async verification(dto: ConfirmationDto) {
    const existingToken = await this.prismaService.token.findUnique({
      where: { token: dto.token, type: TokenType.VERIFICATION },
    });
    if (!existingToken) throw new NotFoundException(`Token ${dto.token} not found`);

    const hasExpired = new Date(existingToken.expiresIn) < new Date();
    if (hasExpired)
      throw new BadRequestException('Your token has expired. Please request a new one to continue');

    const { name, email, password } = existingToken.data as {
      name: string;
      email: string;
      password: string;
    };

    const user = await this.userService.create(
      name,
      email,
      password,
      '',
      AuthMethod.CREDENTIALS,
      true,
    );

    await this.prismaService.token.delete({
      where: { id: existingToken.id },
    });

    const tokens = this.authService.issueTokens(user.id);

    return { user, ...tokens };
  }

  private async generateVerificationToken(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    const token = uuid();
    const expiresIn = new Date(new Date().getTime() + 1800 * 1000);

    const existingToken = await this.prismaService.token.findFirst({
      where: { email: userData.email, type: TokenType.VERIFICATION },
    });

    if (existingToken)
      await this.prismaService.token.delete({
        where: { id: existingToken.id, type: TokenType.VERIFICATION },
      });

    userData.password = userData.password ? await hash(userData.password) : '';

    await this.prismaService.token.create({
      data: {
        email: userData.email,
        token,
        expiresIn,
        type: TokenType.VERIFICATION,
        data: userData,
      },
    });

    return token;
  }
}
