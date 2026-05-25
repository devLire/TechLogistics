import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import MovimientosRow from './components/SalidaRow';
import { MetricaCard } from '@/components/MetricaCard.tsx';
import DetalleMovimientoModal from '@/pages/reportes/components/DetalleMovimientoModal.tsx';

import { getMovimientosAction } from '@/actions/movimientos.action.ts';

type TipoFiltro = 'TODOS' | 'INGRESO' | 'SALIDA';

export default function ReportesMovimientos() {
  const [pagina, setPagina] = useState(1);
  const limite = 10;

  const [filtroTipo, setFiltroTipo] = useState<TipoFiltro>('TODOS');

  const [modalOpen, setModalOpen] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPagina((prev) => (prev === 1 ? prev : 1));
  }, [filtroTipo]);

  const handleOpenModal = (id: number) => {
    setIdSeleccionado(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIdSeleccionado(null);
  };

  const { data: dataMovimientos, isLoading } = useQuery({
    queryKey: ['movimientos', pagina, filtroTipo],
    queryFn: () =>
      getMovimientosAction({
        limit: limite,
        page: pagina,
        tipo: filtroTipo === 'TODOS' ? undefined : filtroTipo,
      }),
    placeholderData: (previousData) => previousData,
  });

  const movimientos = dataMovimientos?.data || [];
  const pagination = dataMovimientos?.pagination;

  const valorTotalNumber = Number(dataMovimientos?.total_acumulado || 0);
  const valorTotal = valorTotalNumber.toFixed(2);

  const titulo =
    filtroTipo === 'TODOS'
      ? 'Historial de Movimientos'
      : filtroTipo === 'INGRESO'
        ? 'Reportes de Ingresos'
        : 'Reportes de Despachos';

  const subtitulo =
    filtroTipo === 'TODOS'
      ? 'Auditoría completa de entradas y salidas del almacén'
      : filtroTipo === 'INGRESO'
        ? 'Historial de mercancía recibida por proveedores'
        : 'Historial de mercancía retirada del almacén';

  const labelTotal =
    filtroTipo === 'TODOS'
      ? 'Valor total operado'
      : filtroTipo === 'INGRESO'
        ? 'Valor total ingresado'
        : 'Valor total despachado';

  if (isLoading && !movimientos.length)
    return (
      <p className="animate-pulse p-6 text-gray-100">Cargando operaciones...</p>
    );

  return (
    <div className="text-gray-100">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="mb-1 text-[22px] font-semibold text-white transition-all">
            {titulo}
          </h1>
          <p className="text-[13px] text-gray-400">{subtitulo}</p>
        </div>

        <div className="flex rounded-lg border border-white/10 bg-[#1a1a1a] p-1 shadow-sm">
          {(['TODOS', 'INGRESO', 'SALIDA'] as TipoFiltro[]).map((tipo) => (
            <button
              key={tipo}
              className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-semibold tracking-wider transition-all duration-200 ${
                filtroTipo === tipo
                  ? 'bg-white/10 text-white shadow'
                  : 'text-gray-500 hover:bg-white/[0.02] hover:text-gray-300'
              }`}
              onClick={() => setFiltroTipo(tipo)}
            >
              {tipo === 'TODOS' ? 'GLOBAL' : tipo}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricaCard label={labelTotal} valor={`S/ ${valorTotal}`} />
        <MetricaCard
          label="Total de transacciones"
          valor={dataMovimientos?.total_movimientos.toString() || '0'}
        />
        <MetricaCard
          label="Valor prom. por operación"
          valor={`S/ ${(valorTotalNumber / (dataMovimientos?.total_movimientos || 1)).toFixed(2)}`}
        />
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {[
                  '#',
                  'Fecha y hora',
                  'Valor (S/)',
                  'Tipo de Operación',
                  'Operario',
                  'Detalles',
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
              {movimientos.length === 0 ? (
                <tr>
                  <td className="py-12 text-center text-gray-500" colSpan={6}>
                    No se encontraron registros para este filtro.
                  </td>
                </tr>
              ) : (
                movimientos.map((m, i: number) => (
                  <MovimientosRow
                    key={m.id_movimiento_inventario}
                    isLast={i === movimientos.length - 1}
                    movimiento={m}
                    onVerDetalle={handleOpenModal}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Mostrando {movimientos.length} de {pagination?.total || 0} registros
        </span>
        <div className="flex gap-2">
          <button
            className="cursor-pointer rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="cursor-pointer rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
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

      <DetalleMovimientoModal
        idMovimiento={idSeleccionado}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
