import { StaleBadge } from './StatusBadge'

export function SummaryCard({ label, value, note, tone = 'cyan', stale }) {
  return <article className={`summary-card summary-${tone}`}>
    <div className="summary-card-top"><span>{label}</span>{stale && <StaleBadge />}</div>
    <div className="summary-value">{value}</div>
    <div className="summary-note">{note}</div>
  </article>
}
