import { api } from '../api/api';
import type { VentasResponse } from '../infrastructure/interfaces/responses/ventas.response';

interface Options {
  limit?: number | string;
  page?: number | string;
  search?: string;
}

export const getVentas = async (options: Options) => {
  const { limit, page, search } = options;

  const { data } = await api.get<VentasResponse>('/ventas', {
    params: {
      limit,
      page,
      search
    }
  });
  return data;
};

export const getVentaByID = async (id: string) => {
  const { data } = await api.get(`/ventas/${id}`);
  return data;
};

export const createVenta = async (venta: unknown) => {
  const { data } = await api.post('/ventas', venta);
  return data;
};

export const updateVenta = async ({ id, data: ventaData }: { id: string, data: unknown }) => {
  const { data } = await api.put(`/ventas/${id}`, ventaData);
  return data;
};
