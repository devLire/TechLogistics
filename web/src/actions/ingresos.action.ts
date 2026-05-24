import {api} from '../api/api';
import type {IngresosResponse} from '../infrastructure/interfaces/responses/ingresos.response';
import type {IngresoInterface} from "@/infrastructure/interfaces/models";

export type CreateIngresoPayload = Omit<IngresoInterface, 'id_inventario' | 'producto' | 'usuario'>;

interface Options {
  limit?: number | string;
  page?: number | string;
  search?: string;
}

export const getIngresos = async (options: Options) => {
  const { limit, page, search } = options;

  const {data} = await api.get<IngresosResponse>('/ingresos', {
    params: {
      limit,
      page,
      search
    }
  });
  return data;
};

export const getIngresoByID = async (id: string) => {
  const {data} = await api.get(`/ingresos/${id}`);
  return data;
};

export const createIngreso = async (ingreso: CreateIngresoPayload) => {
  const {data} = await api.post('/ingresos', ingreso);
  return data;
};
