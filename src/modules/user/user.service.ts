import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/common/schemas/user.schema';

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

  public async create(
    name: string,
    email: string,
    password: string,
    picture: string,
    method: string,
    isVerified: boolean,
  ) {
    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser) throw new ConflictException(`User with email ${email} already exists`);

    if (!name || !email || !password)
      throw new ConflictException('Name, email, and password are required');

    const newUser = await this.userModel.create({
      name,
      email,
      password,
      picture,
      method,
      isVerified,
    });

    return newUser.toObject();
  }
}
