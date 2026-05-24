import {useState} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import IngresoItem from './components/IngresoItem'
import IngresoModal from './components/IngresoModal'
import {getIngresos, createIngreso} from '@/actions/ingresos.action.ts'
import {getProductos} from '@/actions/productos.action.ts'
import {useAuthStore} from "@/stores/auth/useAuthStore.ts";
import type {IngresoInterface} from '@/infrastructure/interfaces/models/ingreso.interface'

export default function Ingresos() {
  const queryClient = useQueryClient()
  const {user} = useAuthStore();

  const [pagina, setPagina] = useState(1);
  const limite = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngreso, setSelectedIngreso] = useState<IngresoInterface | null>(null);

  const {data} = useQuery({
    queryKey: ['ingresos', pagina],
    queryFn: () => getIngresos({
      limit: limite,
      page: pagina
    }),
    placeholderData: (previousData) => previousData,
  })
  const historial = data?.data || []
  const pagination = data?.pagination

  const {data: productosResponse} = useQuery({
    queryKey: ['productos', 'lista-completa'],
    queryFn: () => getProductos({limit: 1000})
  })

  const productos = productosResponse?.data || []

  // Crear
  const createMutation = useMutation({
    mutationFn: createIngreso,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['ingresos']})
      queryClient.invalidateQueries({queryKey: ['productos']})
      setIsModalOpen(false)
      alert('Ingreso creado con éxito');
    },
    onError: (error) => {
      console.error(error);
      alert('Error al crear el ingreso');
    }
  })

  const handleOpenCreate = () => {
    setSelectedIngreso(null)
    setIsModalOpen(true)
  }

  const handleSubmit = (formData: Partial<IngresoInterface>) => {
    const payload = {
      ...formData,
      id_usuario: user!.id_usuario,
    } as unknown as Parameters<typeof createIngreso>[0]

    createMutation.mutate(payload);
  }

  return (
    <div className="text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold mb-1 text-white">Ingresos de Inventario</h1>
          <p className="text-[13px] text-gray-400">Registra la llegada de mercadería del proveedor</p>
        </div>

        {
          user?.rol === 'ADMINISTRADOR' || user?.rol === 'INVENTARIO' && (
            <button onClick={handleOpenCreate}
                    className="px-5 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-[#0f4c35] rounded-lg font-bold transition-colors cursor-pointer">
              + Nuevo Ingreso
            </button>

          )
        }
      </div>

      {/* Historial */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-[#121212] shadow-md">
        <table className="w-full border-collapse text-sm">
          <thead>
          <tr className="bg-white/5 border-b border-white/10">
            {['Producto', 'Cantidad', 'Proveedor', 'Fecha', 'Registrado por'].map((h) => (
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
          {historial?.map((h: IngresoInterface, i: number) => (
            <IngresoItem
              key={h.id_inventario}
              ingreso={h as unknown as import('@/infrastructure/interfaces/responses/ingresos.response').Datum}
              isLast={i === historial.length - 1}
            />
          ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-sm text-gray-400">
          Mostrando {historial.length} de {pagination?.total || 0} ingresos
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

      <IngresoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        ingreso={selectedIngreso}
        isLoading={createMutation.isPending}
        productos={productos}
      />
    </div>
  );
}