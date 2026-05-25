import type { Producto } from './OperacionProductItem.tsx';

export interface ItemCarrito extends Producto {
  cantidad: number;
}

export interface PosCartItemProps {
  item: ItemCarrito;
  onCambiarCantidad: (id: number, delta: number) => void;
  onEliminar: (id: number) => void;
}

export default function OperacionCartItem({
  item,
  onCambiarCantidad,
  onEliminar,
}: PosCartItemProps) {
  const precio = Number(item.precio_venta) || 0;

  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2 text-[14px] last:border-none">
      <div className="flex-1 pr-2">
        <p className="leading-tight font-medium text-gray-200">{item.nombre}</p>
        <p className="text-[12px] text-gray-500">S/ {precio.toFixed(2)} c/u</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Controles de cantidad */}
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0f0f0f] p-1">
          <button
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10"
            onClick={() => onCambiarCantidad(item.id_producto, -1)}
          >
            -
          </button>
          <span className="min-w-[20px] text-center font-bold text-white">
            {item.cantidad}
          </span>
          <button
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10"
            onClick={() => onCambiarCantidad(item.id_producto, 1)}
          >
            +
          </button>
        </div>

        {/* Subtotal e indicador de eliminar */}
        <div className="ml-1 flex items-center gap-3">
          <span className="min-w-[65px] text-right font-bold text-[#2ecc71]">
            S/ {(precio * item.cantidad).toFixed(2)}
          </span>
          <button
            className="cursor-pointer p-1 text-lg text-red-500/70 transition-colors hover:text-red-400"
            onClick={() => onEliminar(item.id_producto)}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
