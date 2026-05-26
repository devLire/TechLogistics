import { api } from '../api/api';
import type { GetUsersResponse } from '../infrastructure/interfaces/responses/get-users.response.ts';
import type { UserInterface } from '@/infrastructure/interfaces/models';

interface Options {
  limit?: number | string;
  page?: number | string;
  search?: string;
  estado?: string;
}

export const getUsers = async (options: Options) => {
  const { limit, page, search, estado } = options;

  const { data } = await api.get<GetUsersResponse>('/users', {
    params: {
      limit,
      page,
      search,
      estado,
    },
  });
  return data;
};

export const getUserByID = async (id: string) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const createUser = async (user: UserInterface) => {
  const { data } = await api.post('/users', user);
  return data;
};

export const updateUser = async ({
  id,
  data: userData,
}: {
  id: string;
  data: UserInterface;
}) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
