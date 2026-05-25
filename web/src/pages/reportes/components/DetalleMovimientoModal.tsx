import { useQuery } from '@tanstack/react-query';
import { getMovimientoById } from '@/actions/movimientos.action.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  idMovimiento: number | null;
}

export default function DetalleMovimientoModal({
  isOpen,
  onClose,
  idMovimiento,
}: Props) {
  const { data: respuesta, isLoading } = useQuery({
    queryKey: ['movimiento-salida-detalle', idMovimiento],
    queryFn: () => getMovimientoById(idMovimiento!.toString()),
    enabled: isOpen && idMovimiento !== null,
  });

  if (!isOpen) return null;

  const movimiento = respuesta?.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-2xl">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              Detalle de Despacho
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              {idMovimiento ? `Código de Auditoría: #${idMovimiento}` : ''}
            </p>
          </div>
          <button
            className="cursor-pointer text-lg text-gray-400 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del Modal con Scroll Interno */}
        <div className="custom-scrollbar max-h-[75vh] space-y-6 overflow-y-auto p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4 py-8">
              <div className="mx-auto h-4 w-1/3 rounded bg-slate-800" />
              <div className="h-12 w-full rounded bg-slate-800" />
              <div className="h-24 w-full rounded bg-slate-800" />
            </div>
          ) : !movimiento ? (
            <p className="py-6 text-center text-gray-500">
              No se pudieron recuperar los datos del despacho.
            </p>
          ) : (
            <>
              {/* Bloque 1: Metadatos de la Operación */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/5 bg-[#121212] p-4 text-sm">
                <div>
                  <span className="mb-0.5 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Operario a Cargo
                  </span>
                  <p className="font-medium text-gray-200">
                    {movimiento.usuario?.nombre || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="mb-0.5 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Fecha y Hora
                  </span>
                  <p className="text-gray-200">
                    {new Date(movimiento.fecha_movimiento).toLocaleString(
                      'es-PE'
                    )}
                  </p>
                </div>
                <div className="col-span-2 mt-1 grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                  <div>
                    <span className="mb-0.5 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Área de Movimiento
                    </span>
                    <span className="inline-block rounded border border-blue-800/50 bg-blue-950/40 px-2 py-0.5 text-[11px] font-bold tracking-wider text-blue-400 uppercase">
                      {movimiento.tipo}
                    </span>
                  </div>
                  <div>
                    <span className="mb-0.5 block text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Costo Total Despachado
                    </span>
                    <p className="font-bold text-[#2ecc71]">
                      S/ {Number(movimiento.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bloque 2: Tabla de Artículos Incluidos */}
              <div>
                <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Ítems Retirados de Almacén ({movimiento.detalles?.length || 0}
                  )
                </h3>

                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121212]">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 font-medium text-gray-400 uppercase">
                        <th className="px-4 py-3">Producto</th>
                        <th className="px-4 py-3 text-center">Cantidad</th>
                        <th className="px-4 py-3 text-right">P. Unitario</th>
                        <th className="px-4 py-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {movimiento.detalles?.map((item: any) => (
                        <tr
                          key={item.id_detalle_movimiento}
                          className="hover:bg-white/[0.01]"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-white">
                              {item.producto?.nombre}
                            </p>
                            <p className="mt-0.5 font-mono text-[10px] text-gray-500">
                              {item.producto?.codigo_barras || 'S/N'}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-center font-mono font-semibold text-slate-400">
                            {item.cantidad}
                          </td>
                          <td className="px-4 py-3 text-right font-mono">
                            S/ {Number(item.precio_unitario).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-white">
                            S/ {Number(item.subtotal).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Botón Inferior de Cierre */}
          <div className="pt-2">
            <button
              className="w-full cursor-pointer rounded-lg border border-white/10 bg-[#121212] px-4 py-2.5 font-semibold text-gray-300 transition-all hover:bg-white/5"
              type="button"
              onClick={onClose}
            >
              Cerrar Auditoría
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
