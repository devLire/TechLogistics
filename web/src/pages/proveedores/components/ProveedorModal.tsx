import { useState, useEffect } from 'react'
import type { ProveedorInterface } from '@/infrastructure/interfaces/models/proveedor.interface'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<ProveedorInterface>) => void
  proveedor?: ProveedorInterface | null
  isLoading?: boolean
}

export default function ProveedorModal({
                                        isOpen,
                                        onClose,
                                        onSubmit,
                                        proveedor,
                                        isLoading
                                      }: Props) {

  const initialState: Partial<ProveedorInterface> = {
    nombre_empresa: '',
    contacto: '',
    telefono: ''
  }

  const [formData, setFormData] = useState<Partial<ProveedorInterface>>(initialState)

  useEffect(() => {
    if (proveedor) {
      setFormData(proveedor)
    } else {
      setFormData(initialState)
    }
  }, [proveedor, isOpen])

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
            {proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Nombre de la Empresa</label>
              <input
                required
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none transition-all"
                value={formData.nombre_empresa}
                onChange={e => setFormData({...formData, nombre_empresa: e.target.value})}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Contacto</label>
              <input
                required
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none transition-all"
                value={formData.contacto}
                onChange={e => setFormData({...formData, contacto: e.target.value})}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Teléfono</label>
              <input
                required
                type="tel"
                className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#2ecc71] outline-none transition-all"
                value={formData.telefono}
                onChange={e => setFormData({...formData, telefono: e.target.value})}
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
