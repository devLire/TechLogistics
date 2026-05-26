export interface GetCategoriasResponse {
  status: string;
  message: string;
  data: Datum[];
  pagination: Pagination;
}

export interface Datum {
  activo: boolean;
  id_categoria: number;
  nombre: string;
  descripcion: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  next: string;
  prev: string;
}
