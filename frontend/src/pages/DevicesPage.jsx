import { useMemo, useState } from 'react'
import { DeviceTable } from '../components/DeviceTable'
import { FeedbackPanel } from '../components/FeedbackPanel'
import { Icon } from '../components/Icon'
import { StaleBadge } from '../components/StatusBadge'
import { formatTime } from '../utils/format'

export function DevicesPage({ monitoring }) {
  const { devices, connection, devicesStale, devicesUpdatedAt } = monitoring
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')

  const visible = useMemo(() => (devices || []).filter((device) => {
    const matchesStatus = status === 'All statuses' || device.status === status
    const text = `${device.device_name} ${device.device_type} ${device.ip_address}`.toLowerCase()
    return matchesStatus && text.includes(query.trim().toLowerCase())
  }), [devices, query, status])

  return <>
    <div className="page-heading"><div><div className="page-kicker">INVENTORY / DEVICES</div><h1>Device monitoring</h1><p>Inspect live readings across your simulated network.</p></div><div className="refresh-label"><span className="refresh-pulse"/>AUTO REFRESH · 10 SEC</div></div>

    <section className="devices-panel" aria-label="Device inventory">
      <div className="devices-panel-header"><div><div className="section-eyebrow">NETWORK INVENTORY</div><h2>All devices</h2><p>{devices ? `${devices.length} monitored endpoints` : 'Waiting for device data'}{devicesUpdatedAt && ` · Last received ${formatTime(devicesUpdatedAt)}`}</p></div>{devicesStale && devices && <StaleBadge/>}</div>

      {devices && <div className="device-controls"><label className="search-field"><Icon name="search" size={18}/><span className="sr-only">Search devices</span><input type="search" placeholder="Search name, type, or IP" value={query} onChange={(event) => setQuery(event.target.value)}/></label><label className="status-select"><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Online</option><option>Warning</option><option>Offline</option></select></label></div>}

      {!devices ? <FeedbackPanel loading={connection === 'loading'} title={connection === 'loading' ? 'Loading device inventory' : 'Devices unavailable'} message={connection === 'loading' ? 'Connecting to the FastAPI backend.' : 'Start the backend and the dashboard will retry automatically.'}/> :
        devices.length === 0 ? <FeedbackPanel title="No devices returned" message="The monitoring API returned an empty list."/> :
        visible.length === 0 ? <FeedbackPanel title="No matching devices" message="Try a different search term or status filter."/> :
        <DeviceTable devices={visible} stale={devicesStale}/>}
      {devices && devices.length > 0 && <div className="table-footer">Showing {visible.length} of {devices.length} devices · All readings are simulated</div>}
    </section>
  </>
}
