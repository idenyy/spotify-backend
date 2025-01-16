import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthMethod, UserRole } from '@/common/schemas/enums';

@Schema({ timestamps: true })
export class User {
  readonly _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  picture: string;

  @Prop({ enum: UserRole })
  role: string;

  @Prop({ enum: AuthMethod })
  method: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isTwoFactorEnabled: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
