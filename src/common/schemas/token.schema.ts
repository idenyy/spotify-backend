import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TokenType } from '@/common/schemas/enums';

@Schema({ timestamps: true })
export class Token {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({
    required: true,
    enum: TokenType,
  })
  type: TokenType;

  @Prop({ required: true })
  expiresIn: Date;

  @Prop({ type: Object, required: true })
  data: Record<string, any>;
}

export type TokenDocument = Token & Document;
export const TokenSchema = SchemaFactory.createForClass(Token);
