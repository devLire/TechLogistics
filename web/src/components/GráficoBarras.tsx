import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface ConfigBarra<T> {
  dataKey: keyof T;
  fill: string;
  name?: string;
}

interface GraficoBarrasProps<T> {
  titulo: string;
  data: T[];
  xAxisKey: keyof T;
  barras: ConfigBarra<T>[];
}

interface SkeletonProps {
  titulo?: string;
}

const dataMockSkeleton = [
  { name: '', b1: 40, b2: 25 },
  { name: '', b1: 65, b2: 40 },
  { name: '', b1: 50, b2: 60 },
  { name: '', b1: 85, b2: 35 },
  { name: '', b1: 55, b2: 45 },
];

export const GraficoBarras = <T,>({
  titulo,
  data,
  xAxisKey,
  barras,
}: GraficoBarrasProps<T>) => {
  return (
    <div className="rounded-xl p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-slate-100">{titulo}</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey as string} stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                backgroundColor: '#1a1a1a',
                borderColor: '#1a1a1a',
                color: '#fff',
              }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
            />
            <Legend />

            {/* Renderizado dinámico de las barras */}
            {barras.map((barra) => (
              <Bar
                key={barra.dataKey as string}
                dataKey={barra.dataKey as string}
                fill={barra.fill}
                name={barra.name ?? (barra.dataKey as string)}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const GraficoBarrasSkeleton = ({ titulo }: SkeletonProps) => {
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
          <BarChart data={dataMockSkeleton}>
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
              iconType="rect"
            />

            <Bar
              dataKey="b1"
              fill="#334155"
              isAnimationActive={false}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="b2"
              fill="#1e293b"
              isAnimationActive={false}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

GraficoBarras.Skeleton = GraficoBarrasSkeleton;
