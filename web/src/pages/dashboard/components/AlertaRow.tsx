export interface AlertaProps {
  alerta: {
    id_producto: number;
    nombre: string;
    stock_actual: number;
    stock_minimo: number;
    proveedor: string | any;
  };
  isLast: boolean;
}

export default function AlertaRow({ alerta, isLast }: AlertaProps) {
  const proveedorNombre =
    typeof alerta.proveedor === 'string'
      ? alerta.proveedor
      : alerta.proveedor?.nombre_empresa || 'Desconocido';

  return (
    <tr
      className={`${isLast ? 'border-none' : 'border-b border-white/5'} transition-colors hover:bg-white/[0.02]`}
    >
      <td className="p-4 font-medium text-gray-200">{alerta.nombre}</td>
      <td className="p-4 text-center font-bold text-red-500">
        {alerta.stock_actual}
      </td>
      <td className="p-4 text-center text-gray-500">{alerta.stock_minimo}</td>
      <td className="p-4 text-gray-400">{proveedorNombre}</td>
      <td className="p-4 text-center">
        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-red-500 uppercase">
          Reponer
        </span>
      </td>
    </tr>
  );
}
