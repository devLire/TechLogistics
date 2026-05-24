import { api } from '@/api/api.ts';
import type {AuthResponse} from "../infrastructure/interfaces/responses/auth.response.ts";

export const loginAction = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
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
