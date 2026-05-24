export interface CategoriaProps {
  categoria: {
    id_categoria: number;
    nombre: string;
    descripcion: string;
  };
  isLast: boolean;
  onEdit?: () => void;
  onDelete?: (id: number) => void;
}

export default function CategoriaItem({ categoria, isLast, onEdit, onDelete }: CategoriaProps) {
  return (
    <tr className={`${isLast ? 'border-none' : 'border-b border-white/5'} hover:bg-white/[0.02] transition-colors`}>
      <td className="p-4 font-medium text-gray-200">
        {categoria.nombre}
      </td>
      <td className="p-4 text-gray-400">
        {categoria.descripcion}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1.5 border border-white/10 rounded-md bg-white/5 text-gray-300 text-xs font-medium hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete && onDelete(categoria.id_categoria)}
            className="px-3 py-1.5 border border-red-900/30 rounded-md bg-red-950/20 text-red-400 text-xs font-medium hover:bg-red-900/40 hover:text-red-300 transition-all cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
