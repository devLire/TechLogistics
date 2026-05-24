export interface Producto {
  id_producto: number;
  nombre: string;
  precio_venta: number | string;
  codigo_barras: string;
}

export interface PosProductItemProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}

export default function PosProductItem({ producto, onAgregar }: PosProductItemProps) {
  const precio = Number(producto.precio_venta).toFixed(2);
  
  return (
    <div
      onClick={() => onAgregar(producto)}
      className="flex justify-between items-center p-4 border border-white/5 rounded-xl cursor-pointer bg-[#1a1a1a] hover:bg-[#2ecc71]/10 hover:border-[#2ecc71]/30 transition-all group"
    >
      <div>
        <p className="font-medium text-gray-200 mb-0.5 group-hover:text-white transition-colors">
          {producto.nombre}
        </p>
        <p className="text-[12px] text-gray-500">
          Código: <span className="font-mono">{producto.codigo_barras}</span>
        </p>
      </div>
      <div className="text-right">
      <span className="font-bold text-[#2ecc71] text-lg">
        S/ {precio}
      </span>
        {/* Indicador visual opcional de "stock disponible" */}
        <p className="text-[10px] text-gray-600 uppercase tracking-tighter">Disponible</p>
      </div>
    </div>
  );
}
