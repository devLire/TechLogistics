import {create} from 'zustand';
import type {UserResponse} from '../../infrastructure/interfaces/responses/user.response';

import {loginAction} from "@/actions/login.action.ts";
import {checkAuthAction} from "@/actions/check-auth.action.ts";

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

type AuthState = {
  // Properties
  user: UserResponse | null;
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
      localStorage.setItem('token', data.token);

      set({ user: data.user, token: data.token, authStatus: 'authenticated' });

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, authStatus: 'not-authenticated' });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, authStatus: 'not-authenticated' });
  },

  checkAuthStatus: async () => {
    try {
      const { user, token } = await checkAuthAction();
      set({
        user: user,
        token: token,
        authStatus: 'authenticated',
      });
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({
        user: undefined,
        token: undefined,
        authStatus: 'not-authenticated',
      });

      return false;
    }
  },
}));