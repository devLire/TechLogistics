import { api } from '../api/api';
import type { ProveedoresResponse } from '../infrastructure/interfaces/responses/proveedores.response';
import type {ProveedorInterface} from "@/infrastructure/interfaces/models";

export type CreateProveedorPayload = Omit<ProveedorInterface, 'id_proveedor' | 'activo' | 'productos'>;

interface Options {
  limit?: number | string;
  page?: number | string;
  search?: string;
}

export const getProveedores = async (options: Options) => {
  const { limit, page, search } = options;

  const { data } = await api.get<ProveedoresResponse>('/proveedores', {
    params: {
      limit,
      page,
      search
    }
  });
  return data;
};

export const getProveedorByID = async (id: string) => {
  const { data } = await api.get(`/proveedores/${id}`);
  return data;
};

export const createProveedor = async (proveedor: CreateProveedorPayload) => {
  const { data } = await api.post('/proveedores', proveedor);
  return data;
};

export const updateProveedor = async ({ id, data: proveedorData }: { id: string, data: ProveedorInterface }) => {
  const { data } = await api.put(`/proveedores/${id}`, proveedorData);
  return data;
};

export const deleteProveedor = async (id: string) => {
  const { data } = await api.delete(`/proveedores/${id}`);
  return data;
};
