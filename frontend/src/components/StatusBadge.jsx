export function StatusBadge({ status }) {
  const tone = status === 'Online' ? 'online' : status === 'Warning' ? 'warning' : 'offline'
  return <span className={`status-badge status-${tone}`}><span className="status-dot" />{status}</span>
}

export function StaleBadge() {
  return <span className="stale-badge">STALE</span>
}
