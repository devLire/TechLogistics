import type { UserData } from './get-user.response.ts';

export interface AuthResponse {
  status: string;
  user: UserData;
  token: string;
}
