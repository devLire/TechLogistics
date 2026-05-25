export interface NavItem {
  text: string;
  to?: string;
  roles: Role[];
  children?: NavItem[];
}

type Role = 'ADMINISTRADOR' | 'SUPERVISOR' | 'OPERARIO';

export const routeList: NavItem[] = [
  {
    text: 'Dashboard',
    to: '/dashboard',
    roles: ['ADMINISTRADOR', 'SUPERVISOR'],
  },
  {
    text: 'Terminal de Operaciones',
    to: '/terminal_operaciones',
    roles: ['ADMINISTRADOR', 'OPERARIO'],
  },
  {
    text: 'Productos',
    to: '/productos',
    roles: ['ADMINISTRADOR', 'OPERARIO'],
  },
  {
    text: 'Ingresos',
    to: '/inventario/ingresos',
    roles: ['ADMINISTRADOR'],
  },
  {
    text: 'Proveedores',
    to: '/proveedores',
    roles: ['ADMINISTRADOR'],
  },
  {
    text: 'Categorías',
    to: '/categorias',
    roles: ['ADMINISTRADOR'],
  },
  {
    text: 'Reportes',
    to: '/reportes',
    roles: ['ADMINISTRADOR', 'SUPERVISOR'],
  },
];
