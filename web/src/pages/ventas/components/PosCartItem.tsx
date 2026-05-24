import type { Producto } from './PosProductItem';

export interface ItemCarrito extends Producto {
  cantidad: number;
}

export interface PosCartItemProps {
  item: ItemCarrito;
  onCambiarCantidad: (id: number, delta: number) => void;
  onEliminar: (id: number) => void;
}

export default function PosCartItem({ item, onCambiarCantidad, onEliminar }: PosCartItemProps) {
  const precio = Number(item.precio_venta) || 0;
  
  return (
    <div className="flex justify-between items-center text-[14px] py-2 border-b border-white/5 last:border-none">
      <div className="flex-1 pr-2">
        <p className="font-medium text-gray-200 leading-tight">{item.nombre}</p>
        <p className="text-gray-500 text-[12px]">S/ {precio.toFixed(2)} c/u</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Controles de cantidad */}
        <div className="flex items-center gap-2 bg-[#0f0f0f] rounded-lg border border-white/10 p-1">
          <button
            onClick={() => onCambiarCantidad(item.id_producto, -1)}
            className="w-7 h-7 flex items-center justify-center border border-white/10 rounded-md cursor-pointer bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
          >
            -
          </button>
          <span className="font-bold min-w-[20px] text-center text-white">{item.cantidad}</span>
          <button
            onClick={() => onCambiarCantidad(item.id_producto, 1)}
            className="w-7 h-7 flex items-center justify-center border border-white/10 rounded-md cursor-pointer bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
          >
            +
          </button>
        </div>

        {/* Subtotal e indicador de eliminar */}
        <div className="flex items-center gap-3 ml-1">
        <span className="min-w-[65px] text-right font-bold text-[#2ecc71]">
          S/ {(precio * item.cantidad).toFixed(2)}
        </span>
          <button
            onClick={() => onEliminar(item.id_producto)}
            className="text-red-500/70 hover:text-red-400 p-1 cursor-pointer transition-colors text-lg"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
