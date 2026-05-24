import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/useAuthStore.ts';

const navItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    roles: ['ADMINISTRADOR', 'CAJERO', 'INVENTARIO'],
  },
  { path: '/pos', label: 'Punto de Venta', roles: ['ADMINISTRADOR', 'CAJERO'] },
  {
    path: '/productos',
    label: 'Productos',
    roles: ['ADMINISTRADOR', 'CAJERO', 'INVENTARIO'],
  },
  {
    path: '/inventario/ingresos',
    label: 'Ingresos',
    roles: ['ADMINISTRADOR', 'INVENTARIO'],
  },
  { path: '/proveedores', label: 'Proveedores', roles: ['ADMINISTRADOR'] },
  { path: '/categorias', label: 'Categorías', roles: ['ADMINISTRADOR'] },
  { path: '/reportes', label: 'Reportes', roles: ['ADMINISTRADOR'] },
];

export default function Layout() {
  const { logout, user } = useAuthStore();
  const userRole = user?.rol || localStorage.getItem('rol');

  const filteredNavItems = navItems.filter((item) => {
    if (!userRole) return false;
    return item.roles.includes(userRole);
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#080808]">
      <aside className="flex h-screen w-[260px] shrink-0 flex-col bg-gradient-to-r from-[#0f4c35] to-[#080808] p-6 shadow-2xl">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2ecc71] text-xl font-black text-[#0f4c35]">
            +
          </div>
          <p className="text-xl font-bold tracking-tight text-white">
            Nova Salud
          </p>
        </div>

        <nav className="custom-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto pr-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                } `
              }
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <button
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-bold text-white/70 transition-all hover:bg-red-500/20 hover:text-red-400"
            onClick={logout}
          >
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
      <main className="custom-scrollbar h-screen flex-1 overflow-y-auto bg-[#080808]">
        <div className="mx-auto max-w-[1200px] p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
