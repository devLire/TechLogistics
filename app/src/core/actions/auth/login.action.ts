import { api } from '@/core/api/api';
import type { AuthResponse } from '@/infrastructure/interfaces/responses/auth.response';

export const loginAction = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    console.log(process.env.EXPO_PUBLIC_API_URL + '/auth/login');
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email: email,
      password: password,
    });

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
