import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AuthMethod } from '@/common/schemas/enums';

@Schema()
export class Account {
  readonly _id: Types.ObjectId;

  @Prop({ required: true, enum: AuthMethod })
  provider: string;

  @Prop({ required: true, unique: true })
  providerId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export type AccountDocument = Account & Document;
export const AccountSchema = SchemaFactory.createForClass(Account);
