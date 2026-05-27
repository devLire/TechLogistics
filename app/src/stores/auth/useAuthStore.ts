import type { UserData } from '@/infrastructure/interfaces/responses/get-user.response.ts';
import { create } from 'zustand';

import { checkAuthAction } from '@/core/actions/auth/check-auth.action';
import { loginAction } from '@/core/actions/auth/login.action';
import * as SecureStore from 'expo-secure-store';

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

type AuthState = {
  // Properties
  user: UserData | null;
  token: string | null;
  authStatus: AuthStatus;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
};

export const useAuthStore = create<AuthState>()((set) => ({
  // Implementación del Store
  user: null,
  token: null,
  authStatus: 'checking',

  // Actions
  login: async (email: string, password: string) => {
    try {
      const data = await loginAction(email, password);
      await SecureStore.setItemAsync('token', data.token);
      await SecureStore.setItemAsync('rol', data.user.rol);

      set({
        user: data.user,
        token: data.token,
        authStatus: 'authenticated',
      });

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('rol');
      set({ user: null, token: null, authStatus: 'not-authenticated' });
      return false;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('rol');
    set({ user: null, token: null, authStatus: 'not-authenticated' });
  },

  checkAuthStatus: async () => {
    try {
      const { user, token } = await checkAuthAction();
      console.log(user, token);
      await SecureStore.setItemAsync('token', user.rol);
      await SecureStore.setItemAsync('rol', user.rol);
      set({
        user: user,
        token: token,
        authStatus: 'authenticated',
      });
      return true;
    } catch (error) {
      console.error(error);
      await SecureStore.deleteItemAsync('rol');
      await SecureStore.deleteItemAsync('token');
      set({
        user: undefined,
        token: undefined,
        authStatus: 'not-authenticated',
      });

      return false;
    }
  },
}));
