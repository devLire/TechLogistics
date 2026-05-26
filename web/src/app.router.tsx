import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import TerminalOperaciones from './pages/terminal_operaciones/TerminalOperaciones.tsx';
import Productos from './pages/productos/Productos';
import Ingresos from './pages/ingresos/Ingresos';
import Proveedores from './pages/proveedores/Proveedores';
import Categorias from './pages/categorias/Categorias';
import Reportes from './pages/reportes/Reportes';
import Layout from './components/Layout';
import {
  AuthenticatedRoute,
  NotAuthenticatedRoute,
  AdminRoute,
  RoleRoute,
} from './components/routes/ProtectedRoutes';
import { Usuarios } from '@/pages/usuarios/Usuarios.tsx';

export const appRouter = createBrowserRouter([
  // Rutas públicas
  {
    path: '/login',
    element: (
      <NotAuthenticatedRoute>
        <Login />
      </NotAuthenticatedRoute>
    ),
  },

  // Rutas privadas
  {
    path: '/',
    element: (
      <AuthenticatedRoute>
        <Layout />
      </AuthenticatedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate replace to="/dashboard" />,
      },
      {
        path: 'dashboard',
        element: (
          <RoleRoute allowedRoles={['SUPERVISOR']}>
            <Dashboard />
          </RoleRoute>
        ),
      },
      {
        path: '/usuarios',
        element: (
          <AdminRoute>
            <Usuarios />
          </AdminRoute>
        ),
      },
      {
        path: '/terminal_operaciones',
        element: (
          <RoleRoute allowedRoles={['OPERARIO', 'SUPERVISOR']}>
            <TerminalOperaciones />
          </RoleRoute>
        ),
      },
      {
        path: 'productos',
        element: (
          <RoleRoute allowedRoles={['OPERARIO', 'SUPERVISOR']}>
            <Productos />
          </RoleRoute>
        ),
      },
      {
        path: 'inventario/ingresos',
        element: (
          <RoleRoute allowedRoles={['SUPERVISOR']}>
            <Ingresos />
          </RoleRoute>
        ),
      },
      {
        path: 'proveedores',
        element: (
          <AdminRoute>
            <Proveedores />
          </AdminRoute>
        ),
      },
      {
        path: 'categorias',
        element: (
          <AdminRoute>
            <Categorias />
          </AdminRoute>
        ),
      },
      {
        path: 'reportes',
        element: (
          <RoleRoute allowedRoles={['SUPERVISOR']}>
            <Reportes />
          </RoleRoute>
        ),
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate replace to="/login" />,
  },
]);
