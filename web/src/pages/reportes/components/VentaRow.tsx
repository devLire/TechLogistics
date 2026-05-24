export interface VentaProps {
  venta: {
    id_venta: number;
    fecha_hora: string;
    total: number | string;
    metodo_pago: string;
    usuario: { nombre: string } | string | any;
    detalles?: any[];
  };
  isLast: boolean;
}

export default function VentaRow({ venta, isLast }: VentaProps) {
  const formatTotal = Number(venta.total).toFixed(2);
  const cajeroName = typeof venta.usuario === 'string' ? venta.usuario : venta.usuario?.nombre || 'N/A';
  const itemsCount = venta.detalles ? venta.detalles.reduce((acc: number, item: any) => acc + item.cantidad, 0) : '-';

  return (
    <tr className={`${isLast ? 'border-none' : 'border-b border-white/5'} hover:bg-white/[0.02] transition-colors`}>
      {/* ID de Venta */}
      <td className="p-4 text-center text-gray-500 font-mono text-xs">
        #{venta.id_venta}
      </td>

      {/* Fecha y Hora */}
      <td className="p-4 text-center text-gray-300">
        {new Date(venta.fecha_hora).toLocaleString()}
      </td>

      {/* Total */}
      <td className="p-4 text-center font-bold text-[#2ecc71]">
        S/ {formatTotal}
      </td>

      {/* Método de Pago */}
      <td className="p-4 text-center text-gray-300">
      <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] uppercase tracking-wider">
        {venta.metodo_pago}
      </span>
      </td>

      {/* Cajero */}
      <td className="p-4 text-center text-gray-300">
        {cajeroName}
      </td>

      {/* Cantidad de Productos */}
      <td className="p-4 text-center text-gray-500">
        {itemsCount} items
      </td>
    </tr>
  );
}
