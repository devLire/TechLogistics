export interface MetricaProps {
  label: string;
  valor: string;
}

export const MetricaCard = ({ label, valor }: MetricaProps) => {
  return (
    <div className="group flex h-[90px] flex-col gap-2 rounded-xl border border-white/5 bg-[#1a1a1a] p-6 shadow-sm transition-all hover:border-[#2ecc71]/30">
      <div className="flex h-[20px] justify-center text-center">
        <p className="text-[11px] leading-tight font-bold tracking-widest text-gray-500 uppercase group-hover:text-gray-400">
          {label}
        </p>
      </div>

      <div className="mt-auto text-center">
        <p className="text-2xl font-semibold text-white">{valor}</p>

        <div className="mt-4 h-1 w-0 rounded-full bg-[#2ecc71] transition-all group-hover:w-full" />
      </div>
    </div>
  );
};
