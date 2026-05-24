import { api } from '../api/api';
import type { ProductsResponse } from '../infrastructure/interfaces/responses/products.response';
import type { AlertasResponse } from '../infrastructure/interfaces/responses/alertas.response';
import type {ProductoInterface} from "@/infrastructure/interfaces/models";

export const getAlertasStock = async () => {
  const { data } = await api.get<AlertasResponse>('/productos/alertas');
  return data.data;
};

interface Options {
  limit?: number | string;
  page?: number | string;
  search?: string;
}

export const getProductos = async (options: Options) => {
  const { limit, page, search } = options;

  const { data } = await api.get<ProductsResponse>('/productos', {
    params: {
      limit,
      page,
      search
    }
  });
  return data;
};

export const getProductoByID = async (id: string) => {
  const { data } = await api.get(`/productos/${id}`);
  return data;
};

export const createProducto = async (producto: ProductoInterface) => {
  const { data } = await api.post('/productos', producto);
  return data;
};

export const updateProducto = async ({ id, data: productoData }: { id: string, data: ProductoInterface }) => {
  const { data } = await api.put(`/productos/${id}`, productoData);
  return data;
};

export const deleteProducto = async (id: string) => {
  const { data } = await api.delete(`/productos/${id}`);
  return data;
};
