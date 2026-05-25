import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/useAuthStore.ts';
import { routeList } from '@/constants/navigation';
import { TechLogisticsIcon } from '@/components/TechLogisticsIcon.tsx';

export default function Layout() {
  const { logout, user } = useAuthStore();
  const userRole = user?.rol || localStorage.getItem('rol');

  const filteredNavItems = routeList.filter((item) => {
    if (!userRole) return false;
    return item.to && item.roles.includes(userRole as any);
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#080808]">
      <aside className="flex h-screen w-[260px] shrink-0 flex-col bg-gradient-to-r from-[#0f4c35] to-[#080808] p-6 shadow-2xl">
        <div className="mb-10 flex items-center gap-3">
          <p className="text-xl font-bold tracking-tight text-white">
            TechLogistics
          </p>
          <TechLogisticsIcon />
        </div>

        <nav className="custom-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto pr-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                } `
              }
              to={item.to!}
            >
              {item.text}
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
