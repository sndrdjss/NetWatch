import { formatTime } from '../utils/format'

export function ConnectionStatus({ connection, lastSuccessfulUpdate }) {
  const label = connection === 'live' ? 'API Live' : connection === 'partial' ? 'API Partial' : connection === 'lost' ? 'API Disconnected' : 'Connecting'
  return <div className={`connection-status connection-${connection}`} role="status" aria-label={`Monitoring API: ${label}`}>
    <span className="connection-dot" />
    <span>{label}</span>
  </div>
}

export function ConnectionBanner({ connection, lastSuccessfulUpdate }) {
  if (connection !== 'lost' && connection !== 'partial') return null

  const lost = connection === 'lost'
  const title = lost
    ? lastSuccessfulUpdate ? 'Connection Lost — Showing Last Known Readings' : 'Connection Lost — No Readings Available Yet'
    : 'Partial API Connection — Some Readings Are Stale'

  return <div className={`connection-banner ${lost ? 'banner-lost' : 'banner-partial'}`} role="alert">
    <div className="banner-symbol">!</div>
    <div>
      <strong>{title}</strong>
      <p>{lastSuccessfulUpdate ? `Last successful update: ${formatTime(lastSuccessfulUpdate)} (local time). Stale sections are labeled below.` : 'Check that the FastAPI backend is running. The dashboard will retry automatically.'}</p>
    </div>
  </div>
}
