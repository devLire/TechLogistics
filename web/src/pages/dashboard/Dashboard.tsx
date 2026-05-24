import {useQuery} from '@tanstack/react-query'
import MetricaCard from './components/MetricaCard'
import AlertaRow from './components/AlertaRow'
import {getAlertasStock, getProductos} from '@/actions/productos.action.ts'
import {getVentas} from '@/actions/ventas.action.ts'
import {getIngresos} from '@/actions/ingresos.action.ts'

export default function Dashboard() {
  const {data: alertas = [], isLoading: loadingAlertas} = useQuery({queryKey: ['alertas'], queryFn: getAlertasStock})
  const {data: dataVentas, isLoading: loadingVentas} = useQuery({
    queryKey: ['ventas'], queryFn: () => getVentas({
      limit: 1000,
      page: 1,
    })
  })
  const {data: dataIngresos, isLoading: loadingIngresos} = useQuery({queryKey: ['ingresos'], queryFn: () => getIngresos({
      limit: 1000,
      page: 1,
    })})

  const {data: productosResponse, isLoading: loadingProductos} = useQuery({
    queryKey: ['productos-total'],
    queryFn: () => getProductos({
      limit: 1,
    })
  })

  const ventas = dataVentas?.data || []
  const ingresos = dataIngresos?.data || []

  const totalVentas = ventas.reduce((s: number, v: any) => s + Number(v.total), 0)

  const totalProductos = productosResponse?.pagination?.total || 0;

  const isLoading = loadingAlertas || loadingVentas || loadingIngresos || loadingProductos

  if (isLoading) return <p className="text-gray-100">Cargando dashboard...</p>

  const metricas = [
    {label: 'Ventas hoy', valor: `S/ ${totalVentas.toFixed(2)}`},
    {label: 'Productos en alerta', valor: alertas.length.toString()},
    {label: 'Ingresos registrados', valor: ingresos.length.toString()},
    {label: 'Total productos', valor: totalProductos.toString()},
  ]

  return (
    <div className="text-gray-100">
      <h1 className="text-2xl font-semibold mb-2 text-white">Dashboard</h1>
      <p className="text-gray-400">Resumen del día y alertas de reposición</p>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 mt-8">
        {metricas.map(m => (
          <MetricaCard key={m.label} label={m.label} valor={m.valor}/>
        ))}
      </div>

      {/* Módulo de alertas */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-white">Alertas de stock bajo</h2>
        <span
          className="bg-red-900/30 text-red-400 border border-red-800/40 rounded-lg px-2.5 py-0.5 text-xs font-bold animate-pulse">
        {alertas.length} CRÍTICAS
      </span>
      </div>

      {alertas.length === 0 ? (
        <div className="bg-[#121212] border border-white/5 rounded-xl p-8 text-center">
          <p className="text-gray-500">No hay productos con stock bajo en este momento.</p>
        </div>
      ) : (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#121212] shadow-xl">
          <table className="w-full border-collapse text-sm">
            <thead>
            <tr className="bg-white/5 border-b border-white/10 text-gray-400">
              <th className="px-4 py-3 text-left font-medium uppercase text-[11px] tracking-wider">Producto</th>
              <th className="px-4 py-3 text-center font-medium uppercase text-[11px] tracking-wider">Stock actual</th>
              <th className="px-4 py-3 text-center font-medium uppercase text-[11px] tracking-wider">Stock mínimo</th>
              <th className="px-4 py-3 text-left font-medium uppercase text-[11px] tracking-wider">Proveedor</th>
              <th className="px-4 py-3 text-center font-medium uppercase text-[11px] tracking-wider">Estado</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {alertas.map((a: any, i: number) => (
              <AlertaRow key={a.id_producto} alerta={a} isLast={i === alertas.length - 1}/>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}