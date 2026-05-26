import { useState, useEffect } from 'react';
import type { ProductoInterface } from '@/infrastructure/interfaces/models/producto.interface';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ProductoInterface>) => void;
  producto?: any | null;
  isLoading?: boolean;
  categorias: any[];
  proveedores: any[];
}

export default function ProductoModal({
  isOpen,
  onClose,
  onSubmit,
  producto,
  isLoading,
  categorias = [],
  proveedores = [],
}: Props) {
  const initialState: Partial<ProductoInterface> = {
    nombre: '',
    codigo_barras: '',
    descripcion: '',
    precio_venta: 0,
    stock_actual: 0,
    stock_minimo: 0,
    id_categoria: 1,
    id_proveedor: 1,
  };

  const [formData, setFormData] =
    useState<Partial<ProductoInterface>>(initialState);

  useEffect(() => {
    if (producto) {
      setFormData({
        ...producto,
        id_categoria:
          (producto as any).categoria?.id_categoria ?? producto.id_categoria,
        id_proveedor:
          (producto as any).proveedor?.id_proveedor ?? producto.id_proveedor,
      });
    } else {
      setFormData({
        nombre: '',
        codigo_barras: '',
        descripcion: '',
        precio_venta: 0,
        stock_actual: 0,
        stock_minimo: 0,
        id_categoria: categorias[0]?.id_categoria || 0,
        id_proveedor: proveedores[0]?.id_proveedor || 0,
      });
    }
  }, [producto, isOpen, categorias, proveedores]);

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
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
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
            {/* NOMBRE */}
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

            {/* CATEGORÍA */}
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase">
                Categoría
              </label>
              <select
                className="w-full cursor-pointer rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm text-white outline-none focus:border-[#2ecc71]"
                value={formData.id_categoria || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_categoria: Number(e.target.value),
                  })
                }
              >
                <option disabled value="">
                  Seleccione...
                </option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* PROVEEDOR */}
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase">
                Proveedor
              </label>
              <select
                className="w-full cursor-pointer rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm text-white outline-none focus:border-[#2ecc71]"
                value={formData.id_proveedor || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_proveedor: Number(e.target.value),
                  })
                }
              >
                <option disabled value="">
                  Seleccione...
                </option>
                {proveedores.map((p) => (
                  <option key={p.id_proveedor} value={p.id_proveedor}>
                    {p.nombre_empresa}
                  </option>
                ))}
              </select>
            </div>

            {/* CÓDIGO BARRAS */}
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase">
                Código de Barras
              </label>
              <input
                required
                className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm text-white outline-none focus:border-[#2ecc71]"
                value={formData.codigo_barras}
                onChange={(e) =>
                  setFormData({ ...formData, codigo_barras: e.target.value })
                }
              />
            </div>

            {/* PRECIO */}
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase">
                Precio (S/)
              </label>
              <input
                required
                className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm text-white outline-none focus:border-[#2ecc71]"
                step="0.01"
                type="number"
                value={formData.precio_venta}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    precio_venta: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* STOCKS */}
            <div className="col-span-1">
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase">
                Stock Act.
              </label>
              <input
                disabled
                required
                className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm text-gray-500 outline-none focus:border-[#2ecc71]"
                type="number"
                value={formData.stock_actual}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock_actual: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="col-span-1">
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase">
                Stock Mín.
              </label>
              <input
                required
                className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm text-white outline-none focus:border-[#2ecc71]"
                type="number"
                value={formData.stock_minimo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock_minimo: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* DESCRIPCIÓN (Agregado de nuevo) */}
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase">
                Descripción
              </label>
              <textarea
                className="w-full resize-none rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm text-white transition-all outline-none focus:border-[#2ecc71]"
                placeholder="Detalles adicionales del producto..."
                rows={3}
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              className="flex-1 cursor-pointer rounded-lg border border-white/10 px-4 py-2.5 font-semibold text-gray-400 transition-all hover:bg-white/5"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="flex-1 cursor-pointer rounded-lg bg-[#2ecc71] px-4 py-2.5 font-bold text-[#0f4c35] transition-all hover:bg-[#27ae60] disabled:opacity-50"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Cargando...' : producto ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
