import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/common/schemas/user.schema';
import { hash } from 'argon2';
import { UserDto } from '@/modules/user/dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  public async findById(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  public async create(dto: UserDto) {
    const existingUser = await this.userModel.findOne({ email: dto.email }).exec();

    if (existingUser) throw new ConflictException(`User with email ${dto.email} already exists`);

    const newUser = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      picture: dto.picture,
      method: dto.method,
      isVerified: dto.isVerified,
    });

    return newUser.toObject();
  }

  public async updatePassword(id: string, password: string) {
    if (!password) throw new ConflictException('Password is required');

    password = await hash(password);

    const user = await this.userModel.findByIdAndUpdate(id, { password }, { new: true }).exec();
    if (!user) throw new NotFoundException('User not found');

    return user.toObject();
  }
}
