import { api } from '@/api/api.ts';
import type { AuthResponse } from '../infrastructure/interfaces/responses/auth.response.ts';

export const checkAuthAction = async (): Promise<AuthResponse> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  try {
    const { data } = await api.get<AuthResponse>('/auth/check-status');
    localStorage.setItem('token', data.token);

    return data;
  } catch (error) {
    localStorage.removeItem('token');
    throw new Error('Token expired or not valid', { cause: error });
  }
};
