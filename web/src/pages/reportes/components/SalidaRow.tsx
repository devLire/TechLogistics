import type { Datum } from '@/infrastructure/interfaces/responses/get-movimientos.response.ts';

export interface SalidaRowProps {
  movimiento: Datum;
  isLast: boolean;
  onVerDetalle: (id: number) => void;
}

export default function SalidaRow({
  movimiento,
  isLast,
  onVerDetalle,
}: SalidaRowProps) {
  const formatTotal = Number(movimiento.total).toFixed(2);
  const operarioName = movimiento.usuario?.nombre || 'N/A';

  return (
    <tr
      className={`${isLast ? 'border-none' : 'border-b border-white/5'} transition-colors hover:bg-white/[0.02]`}
    >
      <td className="p-4 text-center font-mono text-xs text-gray-500">
        #{movimiento.id_movimiento_inventario}
      </td>
      <td className="p-4 text-center text-gray-300">
        {new Date(movimiento.fecha_movimiento).toLocaleString('es-PE')}
      </td>
      <td className="p-4 text-center font-bold text-[#2ecc71]">
        S/ {formatTotal}
      </td>
      <td className="p-4 text-center text-gray-300">
        <span className="rounded border border-blue-900/40 bg-blue-950/30 px-2.5 py-1 text-[10px] font-bold text-blue-400 uppercase">
          {movimiento.tipo}
        </span>
      </td>
      <td className="p-4 text-center text-gray-300">{operarioName}</td>
      <td className="p-4 text-center">
        <button
          className="cursor-pointer text-xs font-medium text-[#2ecc71] underline transition-colors hover:text-[#52ff8b]"
          onClick={() => onVerDetalle(movimiento.id_movimiento_inventario)}
        >
          Ver detalles
        </button>
      </td>
    </tr>
  );
}
