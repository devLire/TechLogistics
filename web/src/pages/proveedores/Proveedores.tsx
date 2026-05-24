import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ProveedorItem from './components/ProveedorItem'
import ProveedorModal from './components/ProveedorModal'
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '@/actions/proveedores.action.ts'
import type { ProveedorInterface } from '@/infrastructure/interfaces/models/proveedor.interface'

export default function Proveedores() {
  const queryClient = useQueryClient()
  const [pagina, setPagina] = useState(1);
  const limite = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorInterface | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['proveedores', pagina],
    queryFn: () => getProveedores({
      limit: limite,
      page: pagina
    }),
    placeholderData: (previousData) => previousData,
  })

  const proveedores = data?.data || []
  const pagination = data?.pagination

  const createMutation = useMutation({
    mutationFn: createProveedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
      setIsModalOpen(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateProveedor as any,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
      setIsModalOpen(false)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProveedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    }
  })

  const handleSubmit = (formData: Partial<ProveedorInterface>) => {
    if (selectedProveedor) {
      updateMutation.mutate({
        id: selectedProveedor.id_proveedor.toString(),
        data: formData
      } as any)
    } else {
      createMutation.mutate(formData as any)
    }
  }

  const handleOpenCreate = () => {
    setSelectedProveedor(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (proveedor: ProveedorInterface) => {
    setSelectedProveedor(proveedor)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      deleteMutation.mutate(id.toString())
    }
  }

  if (isLoading && !data) return <p>Cargando proveedores...</p>

  return (
    <div className="text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold mb-1 text-white">Proveedores</h1>
          <p className="text-[13px] text-gray-400">Gestión de proveedores de la botica</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-[#0f4c35] rounded-lg font-bold transition-colors cursor-pointer"
        >
          + Agregar proveedor
        </button>
      </div>

      <div className="w-full overflow-hidden border border-white/10 rounded-xl bg-[#121212] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
            <tr className="bg-white/5 border-b border-white/10">
              {['Empresa', 'Contacto', 'Teléfono', 'Acciones'].map(h => (
                <th
                  key={h}
                  className="px-4 py-4 text-center font-medium text-gray-400 uppercase text-[11px] tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {proveedores.map((p: any, i: number) => (
              <ProveedorItem
                key={p.id_proveedor}
                proveedor={p}
                isLast={i === proveedores.length - 1}
                onEdit={() => handleOpenEdit(p)}
                onDelete={() => handleDelete(p.id_proveedor)}
              />
            ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-sm text-gray-400">
          Mostrando {proveedores.length} de {pagination?.total || 0} proveedores
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={pagina === 1}
            className="px-3 py-1 bg-[#1a1a1a] border border-white/10 rounded-md text-sm text-gray-300 disabled:opacity-50 hover:bg-white/5 transition-colors cursor-pointer"
          >
            Anterior
          </button>
          <span className="px-3 py-1 bg-[#1a1a1a] border border-white/10 rounded-md text-sm text-[#2ecc71]">
            {pagina} / {Math.ceil((pagination?.total || 0) / (pagination?.limit || limite)) || 1}
          </span>
          <button
            onClick={() => setPagina(p => p + 1)}
            disabled={pagina >= (Math.ceil((pagination?.total || 0) / (pagination?.limit || limite)) || 1)}
            className="px-3 py-1 bg-[#1a1a1a] border border-white/10 rounded-md text-sm text-gray-300 disabled:opacity-50 hover:bg-white/5 transition-colors cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>

      <ProveedorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        proveedor={selectedProveedor}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}