import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailService } from '@/common/libs/mail/mail.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { ConfirmationDto } from './dto/email-confirm.dto';
import { hash } from 'argon2';
import randomstring from 'randomstring';
import { TokenDocument } from '@/common/schemas/token.schema';
import { AuthMethod, TokenType } from '@/common/schemas/enums';

@Injectable()
export class EmailConfirmService {
  constructor(
    @InjectModel('Token') private readonly tokenModel: Model<TokenDocument>,
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
    const existingToken = await this.tokenModel
      .findOne({
        token: dto.token,
        type: TokenType.VERIFICATION,
      })
      .exec();

    if (!existingToken) throw new NotFoundException(`Token ${dto.token} not found`);

    const hasExpired = new Date(existingToken.expiresIn) < new Date();
    if (hasExpired)
      throw new BadRequestException('Your token has expired. Please request a new one to continue');

    const { name, email, password } = existingToken.data as {
      name: string;
      email: string;
      password: string;
    };

    const user = await this.userService.create({
      name,
      email,
      password,
      picture: '',
      method: AuthMethod.CREDENTIALS,
      isVerified: true,
    });

    await this.tokenModel.deleteOne({ _id: existingToken._id }).exec();

    const tokens = this.authService.issueTokens(user.id);

    return { user: user, ...tokens };
  }

  private async generateVerificationToken(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    const token = randomstring.generate({
      length: 8,
      charset: 'alphanumeric',
    });
    const expiresIn = new Date(new Date().getTime() + 1800 * 1000);

    const existingToken = await this.tokenModel
      .findOne({
        email: userData.email,
        type: TokenType.VERIFICATION,
      })
      .exec();

    if (existingToken) await this.tokenModel.deleteOne({ _id: existingToken._id }).exec();

    userData.password = userData.password ? await hash(userData.password) : '';

    await this.tokenModel.create({
      email: userData.email,
      token,
      expiresIn,
      type: TokenType.VERIFICATION,
      data: userData,
    });

    return token;
  }
}
