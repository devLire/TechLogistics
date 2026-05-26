import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { MetricaCard } from '@/components/MetricaCard.tsx';
import DetalleMovimientoModal from '@/pages/reportes/components/DetalleMovimientoModal.tsx';

import { getMovimientosAction } from '@/actions/movimientos.action.ts';
import type { Column } from '@/components/DataTable.tsx';
import { DataTable } from '@/components/DataTable.tsx';
import type { SegmentedControlOption } from '@/components/SegmentedControl.tsx';
import type { Datum as MovimientoDatum } from '@/infrastructure/interfaces/responses/get-movimientos.response.ts';

type TipoFiltro = 'TODOS' | 'INGRESO' | 'SALIDA';

const OPCIONES_FILTRO: SegmentedControlOption<TipoFiltro>[] = [
  { value: 'TODOS', label: 'Todos', color: 'grey' },
  { value: 'INGRESO', label: 'Ingreso', color: 'green' },
  { value: 'SALIDA', label: 'Salida', color: 'red' },
];

export default function ReportesMovimientos() {
  const [inputValue, setInputValue] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const limite = 10;

  const [filtroTipo, setFiltroTipo] = useState<TipoFiltro>('TODOS');

  const [modalOpen, setModalOpen] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPagina((prev) => (prev === 1 ? prev : 1));
  }, [filtroTipo]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setBusqueda(inputValue);
      setPagina(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const handleOpenModal = (id: number) => {
    setIdSeleccionado(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIdSeleccionado(null);
  };

  const { data: dataMovimientos, isFetching } = useQuery({
    queryKey: ['movimientos', pagina, busqueda, filtroTipo],
    queryFn: () =>
      getMovimientosAction({
        limit: limite,
        page: pagina,
        search: busqueda,
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

  const columns: Column<MovimientoDatum>[] = [
    {
      header: '#',
      render: (row) => (
        <span className="font-mono text-xs text-gray-500">
          #{row.id_movimiento_inventario}
        </span>
      ),
    },
    {
      header: 'Fecha y hora',
      render: (row) => (
        <span className="text-gray-300">
          {new Date(row.fecha_movimiento).toLocaleString('es-PE')}
        </span>
      ),
    },
    {
      header: 'Valor (S/)',
      render: (row) => (
        <span className="font-bold text-[#2ecc71]">
          S/ {Number(row.total).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Tipo de Operación',
      render: (row) => (
        <span className="rounded border border-blue-900/40 bg-blue-950/30 px-2.5 py-1 text-[10px] font-bold text-blue-400 uppercase">
          {row.tipo}
        </span>
      ),
    },
    {
      header: 'Operario',
      render: (row) => (
        <span className="text-gray-300">{row.usuario?.nombre || 'N/A'}</span>
      ),
    },
    {
      header: 'Detalles',
      render: (row) => (
        <button
          className="cursor-pointer text-xs font-medium text-[#2ecc71] underline transition-colors hover:text-[#52ff8b]"
          onClick={() => handleOpenModal(row.id_movimiento_inventario)}
        >
          Ver detalles
        </button>
      ),
    },
  ];

  return (
    <div className="text-gray-100">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="mb-1 text-[22px] font-semibold text-white transition-all">
            {titulo}
          </h1>
          <p className="text-[13px] text-gray-400">{subtitulo}</p>
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

      <DataTable
        columns={columns}
        data={movimientos}
        emptyMessage="No se encontraron registros para este filtro."
        isFetching={isFetching}
        keyExtractor={(row) => row.id_movimiento_inventario}
        loadingMessage="Cargando operaciones..."
        pagination={{
          page: pagina,
          total: pagination?.total || 0,
          limit: limite,
          hasPrev: pagina > 1,
          hasNext: pagina < (Math.ceil((pagination?.total || 0) / limite) || 1),
          onPrev: () => setPagina((p) => Math.max(1, p - 1)),
          onNext: () => setPagina((p) => p + 1),
        }}
        search={{
          value: inputValue,
          onChange: setInputValue,
          placeholder: 'Buscar por # o operario...',
          isFetching: isFetching,
        }}
        segmentedControl={{
          options: OPCIONES_FILTRO,
          selectedValue: filtroTipo,
          onChange: setFiltroTipo,
        }}
      />

      <DetalleMovimientoModal
        idMovimiento={idSeleccionado}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
