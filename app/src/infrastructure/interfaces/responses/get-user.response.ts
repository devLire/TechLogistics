import type { ErrorsDetails } from '@/infrastructure/interfaces/error-details.interfaces';

export interface GetUserResponse {
  status: string;
  message: string;
  data: UserData;
  errors: ErrorsDetails[];
}

export interface UserData {
  id_usuario: number;
  nombre: string;
  rol: string;
  email: string;
}
