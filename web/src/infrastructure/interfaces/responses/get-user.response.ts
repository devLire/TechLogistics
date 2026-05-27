import type { ErrorsDetails } from '@/infrastructure/interfaces/error-details.interfaces.ts';

export interface GetUserResponse {
  status: string;
  message: string;
  errors: ErrorsDetails[];
  data: UserData;
}

export interface UserData {
  id_usuario: number;
  nombre: string;
  rol: string;
  email: string;
}
