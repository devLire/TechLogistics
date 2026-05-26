import { useState, useEffect } from 'react';
import type { UserInterface } from '@/infrastructure/interfaces/models/user.interface';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<UserInterface>) => void;
  usuario?: Partial<UserInterface> | null;
  isLoading?: boolean;
}

export default function UsuarioModal({
  isOpen,
  onClose,
  onSubmit,
  usuario,
  isLoading,
}: Props) {
  const initialState: Partial<UserInterface> = {
    nombre: '',
    email: '',
    rol: 'OPERARIO',
    password: '',
  };

  const [formData, setFormData] =
    useState<Partial<UserInterface>>(initialState);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        rol: usuario.rol || 'OPERARIO',
        password: '',
      });
    } else {
      setFormData(initialState);
    }
  }, [usuario, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <h2 className="text-xl font-bold text-white">
            {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button
            className="cursor-pointer text-gray-400 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form
          className="custom-scrollbar max-h-[80vh] space-y-4 overflow-y-auto p-6"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase">
                Nombre
              </label>
              <input
                required
                className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm text-white transition-all outline-none focus:border-[#2ecc71]"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase">
                Email
              </label>
              <input
                required
                className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm text-white transition-all outline-none focus:border-[#2ecc71]"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase">
                Rol
              </label>
              <select
                required
                className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm text-white transition-all outline-none focus:border-[#2ecc71]"
                value={formData.rol}
                onChange={(e) =>
                  setFormData({ ...formData, rol: e.target.value as any })
                }
              >
                <option value="OPERARIO">Operario</option>
                <option value="SUPERVISOR">Supervisor</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase">
                Contraseña {usuario && '(Opcional)'}
              </label>
              <input
                className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm text-white transition-all outline-none focus:border-[#2ecc71]"
                minLength={6}
                required={!usuario}
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              className="cursor-pointer rounded-lg bg-transparent px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:text-white"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="cursor-pointer rounded-lg bg-[#2ecc71] px-5 py-2.5 text-sm font-bold text-[#0f4c35] transition-colors hover:bg-[#27ae60] disabled:opacity-50"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
