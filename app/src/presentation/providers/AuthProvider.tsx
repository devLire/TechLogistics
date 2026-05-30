import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth/useAuthStore';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return <>{children}</>;
};
