type Props = {
  severidade: string;
  size?: 'sm' | 'md';
};

export function SeveridadeBadge({ severidade, size = 'md' }: Props) {
  const colorMap: Record<string, string> = {
    'Bug': 'bg-red-100 text-red-800 border-red-200',
    'Alta': 'bg-orange-100 text-orange-800 border-orange-200',
    'Média': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Baixa': 'bg-green-100 text-green-800 border-green-200',
  };

  const dotMap: Record<string, string> = {
    'Bug': 'bg-red-500',
    'Alta': 'bg-orange-500',
    'Média': 'bg-yellow-500',
    'Baixa': 'bg-green-500',
  };

  const classes = colorMap[severidade] || 'bg-gray-100 text-gray-700 border-gray-200';
  const dotClass = dotMap[severidade] || 'bg-gray-400';
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${classes} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {severidade}
    </span>
  );
}
