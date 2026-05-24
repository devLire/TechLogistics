export interface MetricaProps {
  label: string;
  valor: string;
}

export default function MetricaCard({ label, valor }: MetricaProps) {
  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 shadow-sm hover:border-[#2ecc71]/30 transition-all group flex flex-col h-[160px]">
      <div className="h-[40px] flex items-start">
        <p className="text-[11px] text-gray-500 uppercase font-bold tracking-widest group-hover:text-gray-400 leading-tight">
          {label}
        </p>
      </div>

      <div className="mt-auto">
        <p className="text-2xl font-semibold text-white">
          {valor}
        </p>

        <div className="h-1 w-0 bg-[#2ecc71] mt-4 transition-all group-hover:w-full rounded-full" />
      </div>
    </div>
  );
}
