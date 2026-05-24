import type { PropsWithChildren } from 'react';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { Navigate } from 'react-router-dom';

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();

  if (authStatus === 'checking') return null;

  if (authStatus === 'not-authenticated') {
    return <Navigate to={'/login'} />;
  }

  return children;
};

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();

  if (authStatus === 'checking') return null;

  if (authStatus === 'authenticated') {
    return <Navigate to={'/dashboard'} />; // En la app tu ruta por defecto es dashboard
  }

  return children;
};

export const AdminRoute = ({ children }: PropsWithChildren) => {
  const { authStatus, user } = useAuthStore();

  // Extraemos si el admin según el usuario en store, o del rol guardado previamente
  const isAdmin = user?.rol === 'ADMINISTRADOR' || localStorage.getItem('rol') === 'ADMINISTRADOR';

  if (authStatus === 'checking') return null;

  if (authStatus === 'not-authenticated') {
    return <Navigate to={'/login'} />;
  }

  if (!isAdmin) return <Navigate to={'/dashboard'} />;

  return children;
};

interface RoleRouteProps extends PropsWithChildren {
  allowedRoles: string[];
}

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const { authStatus, user } = useAuthStore();
  const userRole = user?.rol || localStorage.getItem('rol');
  
  if (authStatus === 'checking') return null;

  if (authStatus === 'not-authenticated') {
    return <Navigate to={'/login'} />;
  }

  // Si es ADMINISTRADOR, siempre dale pase. Sino, verifica si su rol está en la lista.
  if (userRole === 'ADMINISTRADOR' || (userRole && allowedRoles.includes(userRole))) {
    return <>{children}</>;
  }

  return <Navigate to={'/dashboard'} />;
};
