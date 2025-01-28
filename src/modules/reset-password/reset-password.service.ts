import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenDocument } from '@/common/schemas/token.schema';
import { MailService } from '@/common/libs/mail/mail.service';
import { UserService } from '@/modules/user/user.service';
import { TokenType } from '@/common/schemas/enums';
import randomstring from 'randomstring';
import { ResetPasswordDto } from '@/modules/reset-password/dto/reset-password.dto';
import { NewPasswordDto } from '@/modules/reset-password/dto/new-password.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectModel('Token') private readonly tokenModel: Model<TokenDocument>,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  public async sendVerificationToken(email: string) {
    const token = await this.generateResetPasswordToken(email);

    await this.mailService.sendResetPassword(email, token);

    return true;
  }

  public async resetPassword(dto: ResetPasswordDto, userId: string) {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (!existingUser)
      throw new NotFoundException(
        `User with email ${dto.email} does not exist. Please check the email and try again`,
      );

    if (existingUser.id != userId)
      throw new BadRequestException('You are not authorized to change the password for this user.');

    const token = await this.generateResetPasswordToken(existingUser.email);

    await this.mailService.sendResetPassword(existingUser.email, token);

    return true;
  }

  public async newPassword(dto: NewPasswordDto, token: string) {
    const existingToken = await this.tokenModel
      .findOne({
        token: token,
        type: TokenType.RESET_PASSWORD,
      })
      .exec();
    if (!existingToken)
      throw new NotFoundException(
        'Invalid or expired token provided. Please request a new password reset',
      );

    const hasExpired = new Date(existingToken.expiresIn) < new Date();
    if (hasExpired)
      throw new BadRequestException('Your token has expired. Please request a new one');

    const existingUser = await this.userService.findByEmail(existingToken.email);
    if (!existingUser) {
      throw new NotFoundException(`User with email ${existingUser.email} not found`);
    }

    await this.userService.updatePassword(existingUser.id, dto.password);

    await this.tokenModel
      .deleteOne({ _id: existingToken._id, type: TokenType.RESET_PASSWORD })
      .exec();

    return true;
  }

  private async generateResetPasswordToken(email: string) {
    const token = randomstring.generate({
      length: 16,
      charset: 'alphanumeric',
    });
    const expiresIn = new Date(new Date().getTime() + 1800 * 1000);

    const existingToken = await this.tokenModel
      .findOne({
        email,
        type: TokenType.RESET_PASSWORD,
      })
      .exec();

    if (existingToken)
      await this.tokenModel
        .deleteOne({ _id: existingToken._id, type: TokenType.RESET_PASSWORD })
        .exec();

    await this.tokenModel.create({
      email,
      token,
      expiresIn,
      type: TokenType.RESET_PASSWORD,
      data: {},
    });

    return token;
  }
}
