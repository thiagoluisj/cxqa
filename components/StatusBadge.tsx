type Props = {
  status: string;
  size?: 'sm' | 'md';
};

export function StatusBadge({ status, size = 'md' }: Props) {
  const colorMap: Record<string, string> = {
    'Aberto': 'bg-blue-100 text-blue-800 border-blue-200',
    'Em Análise': 'bg-purple-100 text-purple-800 border-purple-200',
    'Resolvido': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Descartado': 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const classes = colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${classes} ${sizeClass}`}>
      {status}
    </span>
  );
}
