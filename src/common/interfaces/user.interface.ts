import { Types } from 'mongoose';
import { AuthMethod, UserRole } from '@/common/schemas/enums';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  picture?: string | null;
  role: UserRole;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  method: AuthMethod;
  accounts: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
