import { useState, useEffect } from 'react'
import type { ProductoInterface } from '@/infrastructure/interfaces/models/producto.interface'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<ProductoInterface>) => void
  producto?: ProductoInterface | null
  isLoading?: boolean
  categorias: any[]
  proveedores: any[]
}

export default function ProductoModal({
                                        isOpen,
                                        onClose,
                                        onSubmit,
                                        producto,
                                        isLoading,
                                        categorias = [],
                                        proveedores = []
                                      }: Props) {

  const initialState: Partial<ProductoInterface> = {
    nombre: '',
    codigo_barras: '',
    descripcion: '',
    precio_venta: 0,
    stock_actual: 0,
    stock_minimo: 0,
    id_categoria: 1,
    id_proveedor: 1
  }

  const [formData, setFormData] = useState<Partial<ProductoInterface>>(initialState)

  useEffect(() => {
    if (producto) {
      setFormData({
        ...producto,
        id_categoria: typeof producto.id_categoria === 'object' ? (producto.id_categoria as any).id_categoria : producto.id_categoria,
        id_proveedor: typeof producto.id_proveedor === 'object' ? (producto.id_proveedor as any).id_proveedor : producto.id_proveedor,
      })
    } else {
      setFormData({
        nombre: '',
        codigo_barras: '',
        descripcion: '',
        precio_venta: 0,
        stock_actual: 0,
        stock_minimo: 0,
        id_categoria: categorias[0]?.id_categoria || 0,
        id_proveedor: proveedores[0]?.id_proveedor || 0
      })
    }
  }, [producto, isOpen, categorias, proveedores])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">

            {/* NOMBRE */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Nombre</label>
              <input
                required
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none transition-all"
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
              />
            </div>

            {/* CATEGORÍA */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Categoría</label>
              <select
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none cursor-pointer"
                value={formData.id_categoria || ""}
                onChange={e => setFormData({...formData, id_categoria: Number(e.target.value)})}
              >
                <option value="" disabled>Seleccione...</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                ))}
              </select>
            </div>

            {/* PROVEEDOR */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Proveedor</label>
              <select
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none cursor-pointer"
                value={formData.id_proveedor || ""}
                onChange={e => setFormData({...formData, id_proveedor: Number(e.target.value)})}
              >
                <option value="" disabled>Seleccione...</option>
                {proveedores.map((p) => (
                  <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre_empresa}</option>
                ))}
              </select>
            </div>

            {/* CÓDIGO BARRAS */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Código de Barras</label>
              <input
                required
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none"
                value={formData.codigo_barras}
                onChange={e => setFormData({...formData, codigo_barras: e.target.value})}
              />
            </div>

            {/* PRECIO */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Precio (S/)</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none"
                value={formData.precio_venta}
                onChange={e => setFormData({...formData, precio_venta: Number(e.target.value)})}
              />
            </div>

            {/* STOCKS */}
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Stock Act.</label>
              <input
                type="number"
                required
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-500 cursor-not-allowed focus:border-[#2ecc71] outline-none"
                value={formData.stock_actual}
                disabled
                onChange={e => setFormData({...formData, stock_actual: Number(e.target.value)})}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Stock Mín.</label>
              <input
                type="number"
                required
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none"
                value={formData.stock_minimo}
                onChange={e => setFormData({...formData, stock_minimo: Number(e.target.value)})}
              />
            </div>

            {/* DESCRIPCIÓN (Agregado de nuevo) */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Descripción</label>
              <textarea
                rows={3}
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none resize-none transition-all"
                value={formData.descripcion}
                onChange={e => setFormData({...formData, descripcion: e.target.value})}
                placeholder="Detalles adicionales del producto..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 font-semibold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#2ecc71] hover:bg-[#27ae60] text-[#0f4c35] font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Cargando...' : producto ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}