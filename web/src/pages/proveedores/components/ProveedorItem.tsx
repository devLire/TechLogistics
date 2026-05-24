export interface ProveedorProps {
  proveedor: {
    id_proveedor: number;
    nombre_empresa: string;
    contacto: string;
    telefono: string;
  };
  isLast: boolean;
  onEdit?: () => void;
  onDelete?: (id: number) => void;
}

export default function ProveedorItem({ proveedor, isLast, onEdit, onDelete }: ProveedorProps) {
  return (
    <tr className={`${isLast ? 'border-none' : 'border-b border-white/5'} hover:bg-white/[0.02] transition-colors`}>
      {/* Empresa */}
      <td className="p-4 text-center font-medium text-gray-200">
        {proveedor.nombre_empresa}
      </td>

      {/* Contacto */}
      <td className="p-4 text-center text-gray-300">
        {proveedor.contacto}
      </td>

      {/* Teléfono */}
      <td className="p-4 text-center text-gray-500">
        {proveedor.telefono}
      </td>

      {/* Acciones */}
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1.5 border border-white/10 rounded-md bg-white/5 text-gray-300 text-xs font-medium hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete && onDelete(proveedor.id_proveedor)}
            className="px-3 py-1.5 border border-red-900/30 rounded-md bg-red-950/20 text-red-400 text-xs font-medium hover:bg-red-900/40 hover:text-red-300 transition-all cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
