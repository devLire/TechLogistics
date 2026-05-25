import { useQuery } from '@tanstack/react-query';
import { MetricaCard } from '../../components/MetricaCard.tsx';
import AlertaRow from './components/AlertaRow';

// Importación de las acciones del backend
import { getAlertasStock, getProductos } from '@/actions/productos.action.ts';
import { getMovimientosIngresosAction } from '@/actions/movimientos-ingresos.action.ts';
import {
  getAccesosBiometricosAction,
  getAnomaliasAction,
} from '@/actions/accesos-biometricos.action.ts';

import {
  GraficoBarras,
  type ConfigBarra,
} from '@/components/GráficoBarras.tsx';
import {
  GraficoLineas,
  type ConfigLinea,
} from '@/components/GraficoLineas.tsx';
import {
  transformarDatosAccesos,
  type DataGraficoAcceso,
} from '@/infrastructure/adapters/accesos-biometricos.adapter.ts';

export default function Dashboard() {
  // 1. Carga de Alertas (Para Tabla Izquierda y Gráfico de Líneas)
  const { data: alertas = [], isLoading: loadingAlertas } = useQuery({
    queryKey: ['alertas'],
    queryFn: getAlertasStock,
  });

  // 2. Carga de Ingresos
  const { data: dataIngresos, isLoading: loadingIngresos } = useQuery({
    queryKey: ['ingresos'],
    queryFn: () => getMovimientosIngresosAction({ limit: 1000, page: 1 }),
  });

  // 3. Carga del Total de Productos
  const { data: productosResponse, isLoading: loadingProductos } = useQuery({
    queryKey: ['productos-total'],
    queryFn: () => getProductos({ limit: 1 }),
  });

  // 4. Carga de Accesos Biométricos (Para Gráfico de Barras)
  const {
    data: accesosBiometricos = [],
    isLoading: loadingAccesosBiometricos,
  } = useQuery({
    queryKey: ['accesosBiometricos', { limit: 1000, page: 1 }],
    queryFn: () => getAccesosBiometricosAction({ limit: 1000, page: 1 }),
    select: (response) => transformarDatosAccesos(response.data),
  });

  // 5. Carga de Anomalías (Para Tabla Derecha)
  const { data: anomalias = [], isLoading: loadingAnomalias } = useQuery({
    queryKey: ['anomalias', { limit: 1000, page: 1 }],
    queryFn: () => getAnomaliasAction({ limit: 1000, page: 1 }),
    select: (response) => response.data || [],
  });

  // ONFIGURACIÓN DE GRÁFICOS
  const configBarras: ConfigBarra<DataGraficoAcceso>[] = [
    { dataKey: 'Permitidos', fill: '#10b981', name: 'Accesos Permitidos' },
    { dataKey: 'Denegados', fill: '#ef4444', name: 'Accesos Denegados' },
  ];

  const configLineas: ConfigLinea<any>[] = [
    { dataKey: 'stock_actual', stroke: '#3b82f6', name: 'Stock Actual' }, // Azul
    {
      dataKey: 'stock_minimo',
      stroke: '#f59e0b',
      name: 'Stock Mínimo',
      strokeDasharray: '5 5',
    }, // Naranja Punteado
  ];

  // VARIABLES DERIVADAS
  const ingresos = dataIngresos?.data || [];
  const totalProductos = productosResponse?.pagination?.total || 0;

  // Calculamos el total de accesos sumando permitidos y denegados del adaptador
  const totalAccesosHistoricos = accesosBiometricos.reduce(
    (acc, curr) => acc + curr.Permitidos + curr.Denegados,
    0
  );

  const metricas = [
    { label: 'Productos en alerta (ML)', valor: alertas.length.toString() },
    { label: 'Ingresos registrados', valor: ingresos.length.toString() },
    { label: 'Total en catálogo', valor: totalProductos.toString() },
    { label: 'Eventos Biométricos', valor: totalAccesosHistoricos.toString() },
  ];

  // Pantalla de carga global (opcional, aunque tienes Skeletons)
  const isGlobalLoading = loadingIngresos || loadingProductos;
  if (isGlobalLoading)
    return <p className="p-8 text-gray-400">Cargando módulos principales...</p>;

  return (
    <div className="space-y-6 text-gray-100">
      {/* ENCABEZADO */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Dashboard Informativo
        </h1>
        <p className="text-gray-400">
          Panel de control logístico y telemetría de seguridad IoT
        </p>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.map((m) => (
          <MetricaCard key={m.label} label={m.label} valor={m.valor} />
        ))}
      </div>

      {/* ZONA DE GRÁFICOS (2 Columnas) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico 1: Barras (Auditoría IoT) */}
        {loadingAccesosBiometricos ? (
          <GraficoBarras.Skeleton titulo="Auditoría de Accesos Biométricos (IoT)" />
        ) : (
          <GraficoBarras<DataGraficoAcceso>
            barras={configBarras}
            data={accesosBiometricos}
            titulo="Auditoría de Accesos Biométricos (IoT)"
            xAxisKey="dispositivo"
          />
        )}

        {/* Gráfico 2: Líneas (Machine Learning / Stock) */}
        {loadingAlertas ? (
          <GraficoLineas.Skeleton titulo="Proyección de Agotamiento de Inventario" />
        ) : (
          <GraficoLineas
            data={alertas}
            lineas={configLineas}
            titulo="Proyección de Agotamiento de Inventario"
            xAxisKey="nombre"
          />
        )}
      </div>

      {/* ZONA DE TABLAS INFERIORES */}
      <div className="mt-4 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* TABLA 1: Alertas de Stock */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">
              Alertas de Stock Crítico
            </h2>
            <span className="animate-pulse rounded-lg border border-red-800/40 bg-red-900/30 px-2.5 py-0.5 text-xs font-bold text-red-400">
              {alertas.length} CRÍTICAS
            </span>
          </div>

          {alertas.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-[#121212] p-8 text-center">
              <p className="text-gray-500">
                Stock estabilizado. No hay alertas predictivas.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-xl">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-gray-400">
                    <th className="px-4 py-3 text-left text-[11px] font-medium tracking-wider uppercase">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-medium tracking-wider uppercase">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-medium tracking-wider uppercase">
                      Mínimo
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-medium tracking-wider uppercase">
                      Proveedor
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-medium tracking-wider uppercase">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {alertas.map((a, i: number) => (
                    <AlertaRow
                      key={a.id_producto}
                      alerta={a}
                      isLast={i === alertas.length - 1}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* TABLA 2: Últimas Anomalías de Seguridad */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">
              Log de Seguridad (Anomalías)
            </h2>
          </div>

          {loadingAnomalias ? (
            <div className="h-48 animate-pulse rounded-xl border border-white/10 bg-[#121212] p-8" />
          ) : anomalias.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-[#121212] p-8 text-center">
              <p className="text-gray-500">
                No se registran intentos de acceso denegados.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-xl">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-gray-400">
                    <th className="px-4 py-3 text-left text-[11px] font-medium tracking-wider uppercase">
                      Fecha / Hora
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-medium tracking-wider uppercase">
                      Operario
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-medium tracking-wider uppercase">
                      Dispositivo
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-medium tracking-wider uppercase">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {anomalias.slice(0, 5).map((anomalia) => (
                    <tr
                      key={anomalia.id_acceso_biometrico}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(anomalia.fecha_hora).toLocaleString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {anomalia.usuario?.nombre || 'Desconocido'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {anomalia.dispositivo_autorizado?.nombre_dispositivo ||
                          'Dispositivo no registrado'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="rounded border border-red-800/50 bg-red-900/30 px-2 py-1 text-[10px] font-bold tracking-wider text-red-400">
                          {anomalia.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
