import { useState, useEffect } from 'react'
import type { IngresoInterface } from '@/infrastructure/interfaces/models/ingreso.interface'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<IngresoInterface>) => void
  ingreso?: IngresoInterface | null
  isLoading?: boolean
  productos: any[]
}

export default function IngresoModal({
                                       isOpen,
                                       onClose,
                                       onSubmit,
                                       ingreso,
                                       isLoading,
                                       productos = []
                                     }: Props) {

  const initialState: Partial<IngresoInterface> = {
    id_producto: productos[0]?.id_producto || 0,
    cantidad_ingresada: 1,
    fecha_ingreso: new Date()
  }

  const [formData, setFormData] = useState<Partial<IngresoInterface>>(initialState)
  const [fechaStr, setFechaStr] = useState<string>(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (ingreso) {
      setFormData({
        ...ingreso,
        id_producto: typeof ingreso.id_producto === 'object' ? (ingreso.id_producto as any).id_producto : ingreso.id_producto,
      })
      if (ingreso.fecha_ingreso) {
        setFechaStr(new Date(ingreso.fecha_ingreso).toISOString().split('T')[0])
      }
    } else {
      setFormData({
        id_producto: productos[0]?.id_producto || 0,
        cantidad_ingresada: 1,
      })
      setFechaStr(new Date().toISOString().split('T')[0])
    }
  }, [ingreso, isOpen, productos])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      fecha_ingreso: new Date(fechaStr)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {ingreso ? 'Editar Ingreso' : 'Nuevo Ingreso'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">

            {/* PRODUCTO */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Producto</label>
              <select
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none cursor-pointer"
                value={formData.id_producto || ""}
                required
                onChange={e => setFormData({...formData, id_producto: Number(e.target.value)})}
              >
                <option value="" disabled>Seleccione un producto...</option>
                {productos.map((p) => (
                  <option key={p.id_producto || p.id} value={p.id_producto || p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            {/* CANTIDAD INGRESADA */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Cantidad</label>
              <input
                type="number"
                min="1"
                required
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none transition-all"
                value={formData.cantidad_ingresada}
                onChange={e => setFormData({...formData, cantidad_ingresada: Number(e.target.value)})}
              />
            </div>

            {/* FECHA INGRESO */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Fecha</label>
              <input
                type="date"
                required
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none [color-scheme:dark]"
                value={fechaStr}
                onChange={e => setFechaStr(e.target.value)}
              />
            </div>

          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-transparent rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-bold text-[#0f4c35] bg-[#2ecc71] hover:bg-[#27ae60] rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
