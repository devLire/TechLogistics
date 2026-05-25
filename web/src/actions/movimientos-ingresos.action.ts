import { api } from '../api/api';
import type { GetMovimientosIngresosResponse } from '../infrastructure/interfaces/responses/get-movimientos-ingresos.response.ts';
import type { IngresoInterface } from '@/infrastructure/interfaces/models';

export type CreateIngresoPayload = Omit<
  IngresoInterface,
  'id_inventario' | 'producto' | 'usuario'
>;

interface Options {
  limit?: number | string;
  page?: number | string;
  search?: string;
}

export const getMovimientosIngresosAction = async (options: Options) => {
  const { limit, page, search } = options;

  const { data } = await api.get<GetMovimientosIngresosResponse>(
    '/movimientos-ingresos',
    {
      params: {
        limit,
        page,
        search,
      },
    }
  );
  return data;
};

export const getMovimientoIngresoByID = async (id: string) => {
  const { data } = await api.get(`/movimientos-ingresos/${id}`);
  return data;
};

export const createMovimientoIngreso = async (
  ingreso: CreateIngresoPayload
) => {
  const { data } = await api.post('/movimientos-ingresos', ingreso);
  return data;
};
