import type { UserData } from './get-user.response.ts';
import type { ErrorsDetails } from '@/infrastructure/interfaces/error-details.interfaces.ts';

export interface AuthResponse {
  status: string;
  user: UserData;
  token: string;
  errors: ErrorsDetails[];
}
