import { AuthMethod } from '@/common/schemas/enums';

export interface IOAuthUser {
  provider: AuthMethod;
  providerId: string;
  email: string;
  name: string;
  picture?: string;
}
