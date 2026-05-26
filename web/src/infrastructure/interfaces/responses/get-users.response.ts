export interface GetUsersResponse {
  status: string;
  message: string;
  data: Datum[];
  errors: null;
  pagination: Pagination;
}

export interface Datum {
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
