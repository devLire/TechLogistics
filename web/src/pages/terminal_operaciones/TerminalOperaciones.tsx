import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth/useAuthStore.ts';
import { toast } from 'sonner';

import { getProductos } from '@/actions/productos.action.ts';
import {
  createMovimientoAction,
  type CreateMovimientoPayload,
} from '@/actions/movimientos.action.ts';

import type { Producto } from './components/OperacionProductItem.tsx';
import OperacionProductItem from './components/OperacionProductItem.tsx';
import OperacionCartItem from './components/OperacionCartItem.tsx';
import type { ItemCarrito } from './components/OperacionCartItem.tsx';
import ConfirmModal from '@/components/ConfirmModal.tsx';

type TipoMovimiento = 'INGRESO' | 'SALIDA';

export default function TerminalOperaciones() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [busqueda, setBusqueda] = useState('');
  const [listaOperacion, setListaOperacion] = useState<ItemCarrito[]>([]);
  const [tipoMovimiento, setTipoMovimiento] =
    useState<TipoMovimiento>('SALIDA');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { data: productosResponse, isLoading } = useQuery({
    queryKey: ['productos', 'terminal'],
    queryFn: () => getProductos({ limit: 1000 }),
  });

  const productos = productosResponse?.data || [];

  const { mutate: doEfectuarMovimiento, isPending } = useMutation({
    mutationFn: createMovimientoAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
      setListaOperacion([]);
      setIsConfirmModalOpen(false);
      toast.success('Operación registrada', {
        description: `La operación de ${tipoMovimiento.toLowerCase()} por S/ ${total.toFixed(2)} se ha guardado correctamente.`,
      });
    },
    onError: (error: unknown) => {
      const message =
        (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        'Error desconocido';
      toast.error('Error al registrar operación', {
        description: message,
      });
    },
  });

  const productosFiltrados = productos.filter(
    (p: Producto) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo_barras.includes(busqueda)
  );

  const agregarALista = (producto: Producto) => {
    const existe = listaOperacion.find(
      (i) => i.id_producto === producto.id_producto
    );

    if (existe) {
      const stockActual = (producto as any).stock_actual ?? 0;
      if (tipoMovimiento === 'SALIDA' && existe.cantidad >= stockActual) {
        toast.error('Inventario insuficiente', {
          description: `El stock actual es de ${stockActual} unidades.`,
        });
        return;
      }

      setListaOperacion((prev) =>
        prev.map((i) =>
          i.id_producto === producto.id_producto
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      );
      return;
    }

    const stockActualProducto = (producto as any).stock_actual ?? 0;
    if (tipoMovimiento === 'SALIDA' && stockActualProducto < 1) {
      toast.error('Producto sin stock', {
        description: 'No hay unidades disponibles para despachar.',
      });
      return;
    }

    setListaOperacion((prev) => [...prev, { ...producto, cantidad: 1 }]);
  };

  const cambiarCantidad = (id: number, delta: number) => {
    const item = listaOperacion.find((i) => i.id_producto === id);
    if (!item) return;

    const nuevaCantidad = Math.max(1, item.cantidad + delta);
    const stockActualItem = (item as any).stock_actual ?? 0;
    if (tipoMovimiento === 'SALIDA' && nuevaCantidad > stockActualItem) {
      toast.warning('Stock máximo alcanzado', {
        description: `No puedes exceder el stock actual (${stockActualItem} unidades).`,
      });
      return;
    }

    setListaOperacion((prev) =>
      prev.map((i) =>
        i.id_producto === id ? { ...i, cantidad: nuevaCantidad } : i
      )
    );
  };

  const establecerCantidad = (id: number, cantidad: number) => {
    const item = listaOperacion.find((i) => i.id_producto === id);
    if (!item) return;

    let nuevaCantidad = cantidad < 0 ? 0 : cantidad;
    const stockActualItem = (item as any).stock_actual ?? 0;

    if (tipoMovimiento === 'SALIDA' && nuevaCantidad > stockActualItem) {
      toast.warning('Stock máximo alcanzado', {
        description: `La cantidad se ajustó al stock actual disponible (${stockActualItem} unidades).`,
      });
      nuevaCantidad = stockActualItem;
    }

    setListaOperacion((prev) =>
      prev.map((i) =>
        i.id_producto === id ? { ...i, cantidad: nuevaCantidad } : i
      )
    );
  };

  const eliminarItem = (id: number) =>
    setListaOperacion((prev) => prev.filter((i) => i.id_producto !== id));

  const total = listaOperacion.reduce(
    (sum, i) => sum + Number(i.precio_venta) * i.cantidad,
    0
  );

  const procesarOperacion = () => {
    if (listaOperacion.length === 0) {
      toast.info('Lista vacía', {
        description: 'La lista de operación está vacía. Agrega productos.',
      });
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const confirmarOperacion = () => {
    const payload: CreateMovimientoPayload = {
      id_usuario: user!.id_usuario,
      total: Number(total.toFixed(2)),
      tipo: tipoMovimiento,
      detalles: listaOperacion.map((i) => ({
        id_producto: i.id_producto,
        cantidad: i.cantidad,
        precio_unitario: Number(i.precio_venta),
        subtotal: Number((Number(i.precio_venta) * i.cantidad).toFixed(2)),
        observaciones: `Registro desde terminal web (${tipoMovimiento})`,
      })),
    };

    doEfectuarMovimiento(payload);
  };

  if (isLoading)
    return (
      <div className="animate-pulse p-6 text-gray-100">
        Cargando catálogo...
      </div>
    );

  const colorBoton =
    tipoMovimiento === 'INGRESO'
      ? 'bg-[#2ecc71] hover:bg-[#27ae60] text-[#0f4c35]'
      : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white';
  const colorBordeResaltado =
    tipoMovimiento === 'INGRESO'
      ? 'focus:border-[#2ecc71] focus:ring-[#2ecc71]/20'
      : 'focus:border-[#3b82f6] focus:ring-[#3b82f6]/20';

  return (
    <div className="flex h-[calc(100vh-96px)] gap-6 text-gray-100">
      {/* Panel izquierdo: Buscador de productos */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-[22px] font-semibold text-white">
              Terminal de Almacén
            </h1>
            <p className="text-[13px] text-gray-400">
              Escanea o busca productos para operar
            </p>
          </div>

          {/* Selector de Tipo de Movimiento */}
          <div className="flex rounded-lg border border-white/10 bg-[#1a1a1a] p-1 shadow-sm">
            {(['INGRESO', 'SALIDA'] as TipoMovimiento[]).map((tipo) => (
              <button
                key={tipo}
                className={`cursor-pointer rounded-md px-5 py-2 text-xs font-bold tracking-wider transition-all duration-200 ${
                  tipoMovimiento === tipo
                    ? tipo === 'INGRESO'
                      ? 'bg-[#10b981]/20 text-[#2ecc71] shadow'
                      : 'bg-[#3b82f6]/20 text-[#60a5fa] shadow'
                    : 'text-gray-500 hover:bg-white/[0.02] hover:text-gray-300'
                }`}
                onClick={() => {
                  setTipoMovimiento(tipo);
                  setListaOperacion([]);
                }}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <input
            autoFocus
            className={`w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3.5 text-sm text-gray-200 transition-all outline-none focus:ring-2 ${colorBordeResaltado}`}
            placeholder="Buscar producto o escanear código de barras..."
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="custom-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto pr-2">
          {productosFiltrados.map((p: Producto) => (
            <OperacionProductItem
              key={p.id_producto}
              producto={p}
              tipo_movimiento={tipoMovimiento}
              onAgregar={agregarALista}
            />
          ))}
        </div>
      </div>

      {/* Panel derecho: Bandeja de operación */}
      <div className="flex w-[360px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-5 pb-4">
          <h2 className="text-xs font-semibold tracking-wider text-white uppercase">
            Detalle de Operación
          </h2>
          <span
            className={`rounded border px-2 py-0.5 text-[10px] font-bold tracking-wider ${
              tipoMovimiento === 'INGRESO'
                ? 'border-emerald-800/50 bg-emerald-950/40 text-emerald-400'
                : 'border-blue-800/50 bg-blue-950/40 text-blue-400'
            }`}
          >
            {tipoMovimiento}
          </span>
        </div>

        <div className="custom-scrollbar flex flex-1 flex-col gap-2.5 overflow-y-auto p-5 py-3">
          {listaOperacion.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center opacity-30">
              <p className="mt-2 text-center text-sm">
                Agrega productos para registrar el{' '}
                {tipoMovimiento.toLowerCase()}
              </p>
            </div>
          ) : (
            listaOperacion.map((item) => (
              <OperacionCartItem
                key={item.id_producto}
                item={item}
                tipo_movimiento={tipoMovimiento}
                onCambiarCantidad={cambiarCantidad}
                onEliminar={eliminarItem}
                onSetCantidad={establecerCantidad}
              />
            ))
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center justify-between text-xl font-bold">
            <span className="text-sm tracking-wider text-gray-400 uppercase">
              Valorización
            </span>
            <span
              className={
                tipoMovimiento === 'INGRESO'
                  ? 'text-[#2ecc71]'
                  : 'text-[#60a5fa]'
              }
            >
              S/ {total.toFixed(2)}
            </span>
          </div>

          <button
            className={`w-full rounded-xl border border-white/5 py-4 text-base font-bold shadow-lg transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${colorBoton}`}
            disabled={isPending || listaOperacion.length === 0}
            onClick={procesarOperacion}
          >
            {isPending ? 'Procesando...' : `Confirmar ${tipoMovimiento}`}
          </button>
        </div>
      </div>

      <ConfirmModal
        confirmText={`Registrar ${tipoMovimiento}`}
        isLoading={isPending}
        isOpen={isConfirmModalOpen}
        message={
          <>
            ¿Estás seguro de registrar este{' '}
            <strong>{tipoMovimiento.toLowerCase()}</strong> por un valor total
            de <strong>S/ {total.toFixed(2)}</strong>? Esta acción no se puede
            deshacer.
          </>
        }
        title={`Confirmar ${tipoMovimiento}`}
        type={tipoMovimiento === 'INGRESO' ? 'success' : 'info'}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmarOperacion}
      />
    </div>
  );
}
