import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import CategoriaItem from './components/CategoriaItem'
import CategoriaModal from './components/CategoriaModal'
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../../actions/categorias.action'
import type { CategoriaInterface } from '@/infrastructure/interfaces/models/categoria.interface'

export default function Categorias() {
  const queryClient = useQueryClient()
  const [pagina, setPagina] = useState(1);
  const limite = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaInterface | null>(null);

  const { data: dataCategorias, isLoading } = useQuery({
    queryKey: ['categorias', pagina],
    queryFn: () => getCategorias({
      limit: limite,
      page: pagina
    }),
    placeholderData: (previousData) => previousData,
  })

  const categorias = dataCategorias?.data || []
  const pagination = dataCategorias?.pagination

  const createMutation = useMutation({
    mutationFn: createCategoria as any,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      setIsModalOpen(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateCategoria as any,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      setIsModalOpen(false)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    }
  })

  const handleSubmit = (formData: Partial<CategoriaInterface>) => {
    if (selectedCategoria) {
      updateMutation.mutate({
        id: selectedCategoria.id_categoria.toString(),
        data: formData
      } as any)
    } else {
      createMutation.mutate(formData as any)
    }
  }

  const handleOpenCreate = () => {
    setSelectedCategoria(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (categoria: CategoriaInterface) => {
    setSelectedCategoria(categoria)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      deleteMutation.mutate(id.toString())
    }
  }

  if (isLoading && !dataCategorias) return <p>Cargando categorías...</p>

  return (
    <div className="text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold mb-1 text-white">Categorías</h1>
          <p className="text-[13px] text-gray-400">Clasificación de productos farmacéuticos</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-[#0f4c35] rounded-lg font-bold transition-colors cursor-pointer"
        >
          + Agregar categoría
        </button>
      </div>

      <div className="border border-white/10 rounded-xl overflow-hidden bg-[#121212] shadow-md">
        <table className="w-full border-collapse text-sm">
          <thead>
          <tr className="bg-white/5 border-b border-white/10">
            {['Nombre', 'Descripción', 'Acciones'].map(h => (
              <th key={h} className="px-4 py-3 text-left font-medium text-gray-400 uppercase text-[11px] tracking-wider">
                {h}
              </th>
            ))}
          </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
          {categorias.map((c: any, i: number) => (
            <CategoriaItem
              key={c.id_categoria}
              categoria={c}
              isLast={i === categorias.length - 1}
              onEdit={() => handleOpenEdit(c)}
              onDelete={() => handleDelete(c.id_categoria)}
            />
          ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-sm text-gray-400">
          Mostrando {categorias.length} de {pagination?.total || 0} categorías
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

      <CategoriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        categoria={selectedCategoria}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}