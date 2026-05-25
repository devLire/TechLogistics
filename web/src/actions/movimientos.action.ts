import { api } from '../api/api';
import type { GetMovimientosResponse } from '@/infrastructure/interfaces/responses/get-movimientos.response.ts';

interface Options {
  limit?: number | string;
  page?: number | string;
  search?: string;
  tipo?: string;
}

export interface CreateMovimientoPayload {
  id_usuario: number;
  total: number;
  tipo: 'INGRESO' | 'SALIDA';
  detalles: {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    observaciones?: string;
  }[];
}

export const getMovimientosAction = async (options: Options) => {
  const { limit, page, search, tipo } = options;

  const { data } = await api.get<GetMovimientosResponse>('/movimientos', {
    params: {
      limit,
      page,
      search,
      tipo,
    },
  });
  return data;
};

export const getMovimientoById = async (id: string) => {
  const { data } = await api.get(`/movimientos/${id}`);
  return data;
};

export const createMovimientoAction = async (
  payload: CreateMovimientoPayload
) => {
  const { data } = await api.post('/movimientos', payload);
  return data;
};
