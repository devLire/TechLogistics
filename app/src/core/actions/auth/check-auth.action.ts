import { api } from '@/core/api/api';
import type { AuthResponse } from '@/infrastructure/interfaces/responses/auth.response';
import * as SecureStore from 'expo-secure-store';

export const checkAuthAction = async (): Promise<AuthResponse> => {
  try {
    await SecureStore.setItemAsync('token', '12');
    console.log(await SecureStore.getItemAsync('token'));
    console.log(process.env.EXPO_PUBLIC_API_URL + '/auth/check-status');
    const { data } = await api.get<AuthResponse>('/auth/check-status');
    console.log(data);
    return data;
  } catch (error) {
    throw new Error('Token expired or not valid', { cause: error });
  }
};
