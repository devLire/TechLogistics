export interface IngresoProps {
  ingreso: any;
  isLast: boolean;
}

export default function IngresoItem({ ingreso, isLast }: IngresoProps) {
  const fechaFormateada = new Date(ingreso.fecha_ingreso).toLocaleDateString();

  return (
    <tr
      className={`${isLast ? 'border-none' : 'border-b border-white/5'} transition-colors hover:bg-white/[0.02]`}
    >
      <td className="p-4 font-medium text-gray-200">
        {ingreso.producto?.nombre || 'Desconocido'}
      </td>

      <td className="p-4 text-center font-bold text-[#2ecc71]">
        +{ingreso.cantidad_ingresada}
      </td>

      <td className="p-4 text-center text-gray-300">
        {ingreso.producto?.proveedor?.nombre_empresa || 'Sin proveedor'}
      </td>

      <td className="p-4 text-center text-gray-500">{fechaFormateada}</td>

      <td className="p-4 text-center text-gray-500">
        {ingreso.usuario?.nombre || 'Desconocido'}
      </td>
    </tr>
  );
}
