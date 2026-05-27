import type { ErrorsDetails } from '@/infrastructure/interfaces/error-details.interfaces.ts';

export interface GetUsersResponse {
  status: string;
  message: string;
  data: Datum[];
  errors: ErrorsDetails[];
  pagination: Pagination;
}

export interface Datum {
  activo: boolean;
  id_usuario: number;
  nombre: string;
  email: string;
  rol: Role;
}

type Role = 'ADMINISTRADOR' | 'OPERARIO' | 'SUPERVISOR';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  next: string;
  prev: string;
}
