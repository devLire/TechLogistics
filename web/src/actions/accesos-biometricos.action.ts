import { api } from '../api/api';
import type { GetAccesosBiometricosResponse } from '@/infrastructure/interfaces/responses/get-accesos-biometricos.ts';
import type { GetAnomaliasResponse } from '@/infrastructure/interfaces/responses/get-anomalias.response.ts';

interface Options {
  limit?: number | string;
  page?: number | string;
  search?: string;
}

export const getAccesosBiometricosAction = async (options: Options) => {
  const { limit, page, search } = options;

  const { data } = await api.get<GetAccesosBiometricosResponse>(
    '/accesos-biometricos',
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

export const getAnomaliasAction = async (options: Options) => {
  const { limit, page, search } = options;

  const { data } = await api.get<GetAnomaliasResponse>(
    '/accesos-biometricos/anomalias',
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
