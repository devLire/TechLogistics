import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface ConfigLinea<T> {
  dataKey: keyof T;
  stroke: string;
  name?: string;
  strokeDasharray?: string; // Útil para hacer líneas punteadas (ej: el stock mínimo)
}

interface GraficoLineasProps<T> {
  titulo: string;
  data: T[];
  xAxisKey: keyof T;
  lineas: ConfigLinea<T>[];
}

interface SkeletonProps {
  titulo?: string;
}

const dataMockSkeleton = [
  { name: '', l1: 40, l2: 25 },
  { name: '', l1: 65, l2: 40 },
  { name: '', l1: 50, l2: 60 },
  { name: '', l1: 85, l2: 35 },
  { name: '', l1: 55, l2: 45 },
];

export const GraficoLineas = <T,>({
  titulo,
  data,
  xAxisKey,
  lineas,
}: GraficoLineasProps<T>) => {
  return (
    <div className="rounded-xl bg-[#080808] p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-slate-100">{titulo}</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey as string} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                backgroundColor: '#1a1a1a',
                borderColor: '#27272a',
                color: '#fff',
              }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
            />
            <Legend />

            {/* Renderizado dinámico de las líneas */}
            {lineas.map((linea) => (
              <Line
                key={linea.dataKey as string}
                activeDot={{
                  r: 6,
                  fill: linea.stroke,
                  stroke: '#121212',
                  strokeWidth: 2,
                }}
                dataKey={linea.dataKey as string}
                name={linea.name ?? (linea.dataKey as string)}
                stroke={linea.stroke}
                strokeDasharray={linea.strokeDasharray}
                strokeWidth={3}
                type="monotone"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const GraficoLineasSkeleton = ({ titulo }: SkeletonProps) => {
  const renderItemSkeleton = () => (
    <div className="h-2.5 w-10 rounded bg-slate-800" />
  );

  return (
    <div className="w-full animate-pulse rounded-xl border border-white/10 bg-[#121212] p-6 shadow-md">
      {titulo ? (
        <h3 className="mb-4 text-lg font-semibold text-slate-100">{titulo}</h3>
      ) : (
        <div className="mb-4 h-7 w-1/3 rounded bg-slate-800" />
      )}

      <div className="h-72 w-full">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={dataMockSkeleton}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              stroke="#1e293b"
              tick={renderItemSkeleton}
              tickLine={false}
            />
            <YAxis
              stroke="#1e293b"
              tick={renderItemSkeleton}
              tickLine={false}
            />

            <Legend
              formatter={renderItemSkeleton}
              iconSize={12}
              iconType="circle"
            />

            <Line
              dataKey="l1"
              dot={false}
              isAnimationActive={false}
              stroke="#334155"
              strokeWidth={3}
              type="monotone"
            />
            <Line
              dataKey="l2"
              dot={false}
              isAnimationActive={false}
              stroke="#1e293b"
              strokeWidth={3}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

GraficoLineas.Skeleton = GraficoLineasSkeleton;
