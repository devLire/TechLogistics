export interface UsersResponse {
  status: string;
  message: string;
  data: Datum[];
  pagination: Pagination;
}

export interface Datum {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: Rol;
}

export type Rol = 'ADMINISTRADOR' | 'CAJERO' | 'INVENTARIO';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  next: string;
  prev: null;
}
