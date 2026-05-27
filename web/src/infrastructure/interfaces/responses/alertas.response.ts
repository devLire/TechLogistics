import type { ErrorsDetails } from '@/infrastructure/interfaces/error-details.interfaces.ts';

export interface AlertasResponse {
  status: string;
  message: string;
  data: Datum[];
  errors: ErrorsDetails[];
  count: number;
}

export interface Datum {
  id_producto: number;
  id_categoria: number;
  id_proveedor: number;
  codigo_barras: string;
  nombre: string;
  descripcion: string;
  precio_venta: string;
  stock_actual: number;
  stock_minimo: number;
  activo: boolean;
  proveedor: Proveedor;
  categoria: Categoria;
}

export interface Categoria {
  nombre: string;
}

export interface Proveedor {
  nombre_empresa: string;
  telefono: string;
}
