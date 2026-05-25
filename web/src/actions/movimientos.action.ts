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

export const getMovimientosAction = async (options: Options) => {
  const { limit, page, search } = options;

  const { data } = await api.get<GetMovimientosIngresosResponse>(
    '/movimientos',
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
