import type { Datum } from '@/infrastructure/interfaces/responses/ingresos.response.ts';

export interface IngresoProps {
  ingreso: Datum;
  isLast: boolean;
}

export default function IngresoItem({ ingreso, isLast }: IngresoProps) {
  const fechaFormateada = new Date(ingreso.fecha_ingreso).toLocaleDateString();

  return (
    <tr className={`${isLast ? 'border-none' : 'border-b border-white/5'} hover:bg-white/[0.02] transition-colors`}>
      <td className="p-4 font-medium text-gray-200">
        {ingreso.producto?.nombre || 'Desconocido'}
      </td>

      <td className="p-4 text-[#2ecc71] font-bold text-center">
        +{ingreso.cantidad_ingresada}
      </td>

      <td className="p-4 text-gray-300 text-center">
        {ingreso.producto?.proveedor?.nombre_empresa || 'Sin proveedor'}
      </td>

      <td className="p-4 text-gray-500 text-center">
        {fechaFormateada}
      </td>

      <td className="p-4 text-gray-500 text-center">
        {ingreso.usuario?.nombre || 'Desconocido'}
      </td>

    </tr>
  );
}