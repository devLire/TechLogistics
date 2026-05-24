import type {Datum} from "@/infrastructure/interfaces/responses/products.response.ts";
import {useAuthStore} from "@/stores/auth/useAuthStore.ts";

export interface ProductoProps {
  producto: Datum
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function Product({producto, isLast, onEdit, onDelete}: ProductoProps) {
  const precio = Number(producto.precio_venta).toFixed(2);
  const categoriaNombre = typeof producto.categoria === 'string' ? producto.categoria : (producto.categoria?.nombre || '');
  const {user} = useAuthStore();

  return (
    <tr className={`${isLast ? 'border-none' : 'border-b border-white/5'} hover:bg-white/[0.02] transition-colors`}>
      <td className="p-4 text-center font-medium text-gray-200">
        {producto.nombre}
      </td>

      <td className="p-4 text-center font-medium text-gray-200">
        {producto.proveedor.nombre_empresa}
      </td>

      <td className="p-4 text-center text-gray-500">
        {producto.codigo_barras}
      </td>

      <td className="p-0 text-center text-gray-300">
        S/ {precio}
      </td>

      <td className={`p-4 text-center font-bold ${
        producto.stock_actual < producto.stock_minimo ? 'text-red-500' : 'text-[#2ecc71]'
      }`}>
        {producto.stock_actual}
      </td>

      <td className="p-4 text-center text-gray-500">
        {producto.stock_minimo}
      </td>

      <td className="p-4 text-center text-gray-300">
        {categoriaNombre}
      </td>

      {/* ESTADO CORREGIDO */}
      <td className="p-4 text-center">
        <div className="flex justify-center">
          {producto.stock_actual < producto.stock_minimo ? (
            <span
              className="whitespace-nowrap bg-red-500/10 text-red-500 border border-red-500/20 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
            <span className="text-[10px]">⚠</span> STOCK BAJO
          </span>
          ) : (
            <span
              className="whitespace-nowrap bg-[#2ecc71]/10 text-[#2ecc71] border border-[#2ecc71]/20 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
            <span className="text-[10px]">✓</span> OK
          </span>
          )}
        </div>
      </td>

      {
        user?.rol === 'ADMINISTRADOR' && (
          <td className="p-4 text-center ">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onEdit}
                className="px-3 py-1.5 border border-white/10 rounded-md bg-white/5 text-gray-300 text-xs font-medium hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                Editar
              </button>

              <button
                onClick={onDelete}
                className="px-3 py-1.5 border border-red-500/20 rounded-md bg-red-500/5 text-red-500 text-xs font-medium hover:bg-red-500 hover:text-white transition-all cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </td>
        )
      }

    </tr>
  );
}
