export function formatNumber(value, digits = 1) {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatMetric(value, unit, digits = 1) {
  if (!Number.isFinite(value)) return '—'
  return unit === '%' ? `${formatNumber(value, digits)}%` : `${formatNumber(value, digits)} ${unit}`
}

export function formatTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(date)
}

export function formatChartTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date)
}
