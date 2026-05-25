import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import IngresoItem from './components/IngresoItem';
import IngresoModal from './components/IngresoModal';
import {
  getMovimientosIngresosAction,
  createMovimientoIngreso,
} from '@/actions/movimientos-ingresos.action.ts';
import { getProductos } from '@/actions/productos.action.ts';
import { useAuthStore } from '@/stores/auth/useAuthStore.ts';
import type { IngresoInterface } from '@/infrastructure/interfaces/models/ingreso.interface';

export default function Ingresos() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [pagina, setPagina] = useState(1);
  const limite = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngreso, setSelectedIngreso] =
    useState<IngresoInterface | null>(null);

  const { data } = useQuery({
    queryKey: ['ingresos', pagina],
    queryFn: () =>
      getMovimientosIngresosAction({
        limit: limite,
        page: pagina,
      }),
    placeholderData: (previousData) => previousData,
  });
  const historial = data?.data || [];
  const pagination = data?.pagination;

  const { data: productosResponse } = useQuery({
    queryKey: ['productos', 'lista-completa'],
    queryFn: () => getProductos({ limit: 1000 }),
  });

  const productos = productosResponse?.data || [];

  // Crear
  const createMutation = useMutation({
    mutationFn: createMovimientoIngreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingresos'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      setIsModalOpen(false);
      alert('Ingreso creado con éxito');
    },
    onError: (error) => {
      console.error(error);
      alert('Error al crear el ingreso');
    },
  });

  const handleOpenCreate = () => {
    setSelectedIngreso(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData: Partial<IngresoInterface>) => {
    const payload = {
      ...formData,
      id_usuario: user!.id_usuario,
    } as unknown as Parameters<typeof createMovimientoIngreso>[0];

    createMutation.mutate(payload);
  };

  return (
    <div className="text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-[22px] font-semibold text-white">
            Ingresos de Inventario
          </h1>
          <p className="text-[13px] text-gray-400">
            Registra la llegada de mercadería del proveedor
          </p>
        </div>

        {user?.rol === 'ADMINISTRADOR' ||
          (user?.rol === 'INVENTARIO' && (
            <button
              className="cursor-pointer rounded-lg bg-[#2ecc71] px-5 py-2.5 font-bold text-[#0f4c35] transition-colors hover:bg-[#27ae60]"
              onClick={handleOpenCreate}
            >
              + Nuevo Ingreso
            </button>
          ))}
      </div>

      {/* Historial */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-md">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {[
                'Producto',
                'Cantidad',
                'Proveedor',
                'Fecha',
                'Registrado por',
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-4 text-center text-[11px] font-medium tracking-wider text-gray-400 uppercase"
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
                ingreso={
                  h as unknown as import('@/infrastructure/interfaces/responses/get-movimientos-ingresos.response.ts').Datum
                }
                isLast={i === historial.length - 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Mostrando {historial.length} de {pagination?.total || 0} ingresos
        </span>
        <div className="flex gap-2">
          <button
            className="cursor-pointer rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50"
            disabled={pagina === 1}
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <span className="rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1 text-sm text-[#2ecc71]">
            {pagina} /{' '}
            {Math.ceil(
              (pagination?.total || 0) / (pagination?.limit || limite)
            ) || 1}
          </span>
          <button
            className="cursor-pointer rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50"
            disabled={
              pagina >=
              (Math.ceil(
                (pagination?.total || 0) / (pagination?.limit || limite)
              ) || 1)
            }
            onClick={() => setPagina((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      <IngresoModal
        ingreso={selectedIngreso}
        isLoading={createMutation.isPending}
        isOpen={isModalOpen}
        productos={productos}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
