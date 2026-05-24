import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Producto } from './components/PosProductItem'
import PosProductItem from './components/PosProductItem'
import PosCartItem from './components/PosCartItem'
import type { ItemCarrito } from './components/PosCartItem'
import { getProductos } from '@/actions/productos.action.ts'
import { createVenta } from '@/actions/ventas.action.ts'
import { useAuthStore } from '@/stores/auth/useAuthStore.ts'

export default function POS() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [busqueda, setBusqueda] = useState('')
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [metodoPago, setMetodoPago] = useState('Efectivo')

  const { data: productosResponse, isLoading } = useQuery({
    queryKey: ['productos', 'pos'],
    queryFn: () => getProductos({
      limit: 1000
    }),
  })

  const productos = productosResponse?.data || []

  const { mutate: doEfectuarVenta } = useMutation({
    mutationFn: createVenta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['ventas'] })
      setCarrito([])
      alert(`Venta registrada por S/ ${total.toFixed(2)} - ${metodoPago}`)
    },
    onError: (error: any) => {
      alert(`Error al registrar la venta: ${error?.response?.data?.message || error.message}`)
    }
  })

  const productosFiltrados = productos.filter((p: Producto) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_barras.includes(busqueda)
  )

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito(prev => {
      const existe = prev.find(i => i.id_producto === producto.id_producto)
      if (existe) return prev.map(i => i.id_producto === producto.id_producto ? { ...i, cantidad: i.cantidad + 1 } : i)
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const cambiarCantidad = (id: number, delta: number) => {
    setCarrito(prev =>
      prev.map(i => i.id_producto === id ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } : i)
    )
  }

  const eliminarItem = (id: number) => setCarrito(prev => prev.filter(i => i.id_producto !== id))

  const total = carrito.reduce((sum, i) => sum + Number(i.precio_venta) * i.cantidad, 0)

  const cobrar = () => {
    if (carrito.length === 0) return alert('El carrito está vacío')

    const payload = {
      id_usuario: user!.id_usuario,
      metodo_pago: metodoPago,
      productos: carrito.map(i => ({
        id_producto: i.id_producto,
        cantidad: i.cantidad
      }))
    }

    doEfectuarVenta(payload)
  }

  if (isLoading) return <div className="text-gray-100">Cargando productos...</div>


  return (
    <div className="flex gap-6 text-gray-100 h-[calc(100vh-96px)]">
      {/* Panel izquierdo: buscador de productos */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div>
          <h1 className="text-[22px] font-semibold mb-1 text-white">Punto de Venta</h1>
          <p className="text-[13px] text-gray-400">Busca por nombre o código de barras</p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar producto o escanear código..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-sm text-gray-200 outline-none focus:ring-2 focus:ring-[#2ecc71]/20 focus:border-[#2ecc71] transition-all"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-2">
          {productosFiltrados.map((p: Producto) => (
            <PosProductItem key={p.id_producto} producto={p} onAgregar={agregarAlCarrito} />
          ))}
        </div>
      </div>

      {/* Panel derecho: carrito */}
      <div className="w-[360px] flex flex-col border border-white/10 rounded-xl bg-[#121212] overflow-hidden shadow-2xl">
        <div className="p-5 pb-4 border-b border-white/10 bg-white/5">
          <h2 className="text-base font-semibold text-white uppercase tracking-wider text-xs">Detalle de venta</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-5 py-3 flex flex-col gap-2.5 custom-scrollbar">
          {carrito.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-30">
              <p className="text-sm mt-2 text-center">Agrega productos al carrito</p>
            </div>
          ) : (
            carrito.map(item => (
              <PosCartItem
                key={item.id_producto}
                item={item}
                onCambiarCantidad={cambiarCantidad}
                onEliminar={eliminarItem}
              />
            ))
          )}
        </div>

        <div className="p-5 border-t border-white/10 bg-white/5 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xl font-bold mb-1">
            <span className="text-gray-400">Total</span>
            <span className="text-[#2ecc71]">S/ {total.toFixed(2)}</span>
          </div>

          <select
            value={metodoPago}
            onChange={e => setMetodoPago(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#0f0f0f] border border-white/10 rounded-lg text-sm text-gray-200 outline-none focus:ring-2 focus:ring-[#2ecc71]/20 focus:border-[#2ecc71] [color-scheme:dark]"
          >
            <option value="Efectivo" className="bg-[#1a1a1a]">Efectivo</option>
            <option value="Tarjeta" className="bg-[#1a1a1a]">Tarjeta</option>
          </select>

          <button
            onClick={cobrar}
            className="w-full py-4 bg-[#0f4c35] hover:bg-[#145a40] text-white rounded-xl text-base font-bold transition-all active:scale-[0.98] shadow-lg border border-white/5"
          >
            Cobrar S/ {total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}