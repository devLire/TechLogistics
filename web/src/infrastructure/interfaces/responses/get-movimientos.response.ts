export interface GetMovimientosResponse {
  status: string;
  message: string;
  total_acumulado: string;
  total_movimientos: number;
  data: Datum[];
  pagination: Pagination;
}

export interface Datum {
  id_movimiento_inventario: number;
  id_usuario: number;
  fecha_movimiento: Date;
  total: string;
  tipo: Tipo;
  usuario: Usuario;
}

export type Tipo = 'INGRESO' | 'SALIDA';

export interface Usuario {
  id_usuario: number;
  nombre: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  next: string;
  prev: string;
}
