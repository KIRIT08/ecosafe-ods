export const riskMeta = {
  Alto: {
    bg: '#ef4444',
    border: '#fecaca',
    className: 'bg-red-400 text-red-950',
    text: 'text-red-200',
  },
  Medio: {
    bg: '#facc15',
    border: '#fef08a',
    className: 'bg-amber-300 text-amber-950',
    text: 'text-amber-200',
  },
  Bajo: {
    bg: '#22c55e',
    border: '#bbf7d0',
    className: 'bg-emerald-400 text-emerald-950',
    text: 'text-emerald-200',
  },
}

export function getRiskMeta(level) {
  return riskMeta[level] || riskMeta.Bajo
}
