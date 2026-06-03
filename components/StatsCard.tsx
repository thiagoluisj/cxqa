type Props = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'green' | 'purple';
  subtitle?: string;
};

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    value: 'text-blue-700',
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    value: 'text-red-700',
  },
  green: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    value: 'text-emerald-700',
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    value: 'text-purple-700',
  },
};

export function StatsCard({ title, value, icon, color, subtitle }: Props) {
  const c = colorMap[color];

  return (
    <div className={`card p-5 ${c.bg} border-0`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${c.value}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center ${c.iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
