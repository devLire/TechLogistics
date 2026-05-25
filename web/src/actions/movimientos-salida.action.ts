import { api } from '../api/api';
import type { IngresoInterface } from '@/infrastructure/interfaces/models';
import type { GetMovimientosSalidasResponse } from '@/infrastructure/interfaces/responses/get-movimientos-salidas.response.ts';

export type CreateIngresoPayload = Omit<
  IngresoInterface,
  'id_inventario' | 'producto' | 'usuario'
>;

interface Options {
  limit?: number | string;
  page?: number | string;
  search?: string;
}

export const getMovimientosSalidasAction = async (options: Options) => {
  const { limit, page, search } = options;

  const { data } = await api.get<GetMovimientosSalidasResponse>(
    '/movimientos-salidas',
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

export const getMovimientoSalidaById = async (id: string) => {
  const { data } = await api.get(`/movimientos-salidas/${id}`);
  return data;
};

export const createMovimientoSalida = async (ingreso: CreateIngresoPayload) => {
  const { data } = await api.post('/movimientos-salidas', ingreso);
  return data;
};
