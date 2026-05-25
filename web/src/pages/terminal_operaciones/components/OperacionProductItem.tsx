export interface Producto {
  id_producto: number;
  nombre: string;
  precio_venta: number | string;
  codigo_barras: string;
  // stock_actual se usa en validaciones de la terminal. Puede venir como número.
  stock_actual?: number;
}

export interface PosProductItemProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
  tipo_movimiento: 'INGRESO' | 'SALIDA';
}

export default function OperacionProductItem({
  producto,
  onAgregar,
  tipo_movimiento,
}: PosProductItemProps) {
  const precio = Number(producto.precio_venta).toFixed(2);

  return (
    <div
      className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-[#1a1a1a] p-4 transition-all hover:border-[#2ecc71]/30 hover:bg-[#2ecc71]/10"
      onClick={() => onAgregar(producto)}
    >
      <div>
        <p className="mb-0.5 font-medium text-gray-200 transition-colors group-hover:text-white">
          {producto.nombre}
        </p>
        <p className="text-[12px] text-gray-500">
          Código: <span className="font-mono">{producto.codigo_barras}</span>
        </p>
      </div>
      <div className="text-right">
        <span
          className={`text-lg font-bold ${
            tipo_movimiento === 'INGRESO' ? 'text-[#2ecc71]' : 'text-[#60a5fa]'
          }`}
        >
          S/ {precio}
        </span>
        <p className="text-[10px] tracking-tighter text-gray-600 uppercase">
          Disponible
        </p>
      </div>
    </div>
  );
}
