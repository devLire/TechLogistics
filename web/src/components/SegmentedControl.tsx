export type SegmentedControlColor = 'red' | 'green' | 'blue' | 'grey';

export interface SegmentedControlOption<T> {
  value: T;
  label: string;
  color?: SegmentedControlColor;
}

interface SegmentedControlProps<T> {
  options: SegmentedControlOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
}

export const SegmentedControl = <T extends string | number>({
  options,
  selectedValue,
  onChange,
}: SegmentedControlProps<T>) => {
  const getButtonStyles = (
    color?: SegmentedControlColor,
    isActive?: boolean
  ) => {
    if (!isActive) {
      return 'text-gray-500 hover:bg-white/[0.02] hover:text-gray-300';
    }

    switch (color) {
      case 'green':
        return 'bg-[#10b981]/20 text-[#2ecc71] shadow';
      case 'red':
        return 'bg-red-500/20 text-red-400 shadow';
      case 'blue':
        return 'bg-[#3b82f6]/20 text-[#60a5fa] shadow';
      case 'grey':
      default:
        return 'bg-white/10 text-white shadow';
    }
  };

  return (
    <div className="flex rounded-lg border border-white/10 bg-[#1a1a1a] p-1 shadow-sm">
      {options.map((option) => (
        <button
          key={option.value}
          className={`cursor-pointer rounded-md px-5 py-2 text-xs font-bold tracking-wider transition-all duration-200 ${getButtonStyles(
            option.color,
            selectedValue === option.value
          )}`}
          type="button"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
