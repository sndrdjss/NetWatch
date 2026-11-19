import { lazy, Suspense } from 'react'
import { FeedbackPanel } from '../components/FeedbackPanel'
import { SummaryCard } from '../components/SummaryCard'
import { StaleBadge, StatusBadge } from '../components/StatusBadge'
import { formatMetric, formatTime } from '../utils/format'

const LatencyChart = lazy(() => import('../components/MonitoringCharts').then((module) => ({ default: module.LatencyChart })))
const TrafficChart = lazy(() => import('../components/MonitoringCharts').then((module) => ({ default: module.TrafficChart })))

export function DashboardPage({ monitoring }) {
  const { summary, devices, history, connection, summaryStale, devicesStale, summaryUpdatedAt, devicesUpdatedAt } = monitoring

  return <>
    <div className="page-heading">
      <div><div className="page-kicker">CONTROL CENTER / DASHBOARD</div><h1>Network overview</h1><p>At-a-glance health of your simulated infrastructure.</p></div>
      <div className="refresh-label"><span className="refresh-pulse"/>AUTO REFRESH · 10 SEC</div>
    </div>

    <section aria-label="Dashboard summary">
      <div className="section-title-row"><div><div className="section-eyebrow">FLEET STATUS</div><h2>Monitoring summary</h2></div><div className="section-meta">{summaryStale && summary && <StaleBadge/>}{summaryUpdatedAt ? `Last received ${formatTime(summaryUpdatedAt)}` : 'Waiting for data'}</div></div>
      {!summary ? <FeedbackPanel loading={connection === 'loading'} title={connection === 'loading' ? 'Loading monitoring summary' : 'Summary unavailable'} message={connection === 'loading' ? 'Connecting to the FastAPI backend.' : 'Start the backend and the dashboard will retry automatically.'}/> :
        <div className="summary-grid">
          <SummaryCard label="Total devices" value={summary.total_devices} note="Monitored endpoints" tone="cyan" stale={summaryStale}/>
          <SummaryCard label="Online" value={summary.online_devices} note="Operating normally" tone="green" stale={summaryStale}/>
          <SummaryCard label="Warning" value={summary.warning_devices} note="Needs attention" tone="amber" stale={summaryStale}/>
          <SummaryCard label="Offline" value={summary.offline_devices} note="Not responding" tone="red" stale={summaryStale}/>
          <SummaryCard label="Average latency" value={formatMetric(summary.average_latency_ms, 'ms')} note="Reachable devices only" tone="blue" stale={summaryStale}/>
        </div>}
    </section>

    <section aria-label="Performance charts" className="dashboard-section">
      <div className="section-title-row"><div><div className="section-eyebrow">PERFORMANCE</div><h2>Live session trends</h2></div><div className="section-meta">Collected only while this page is open</div></div>
      <Suspense fallback={<FeedbackPanel loading title="Loading charts" message="Preparing the live session view."/>}>
        <div className="chart-grid"><LatencyChart history={history} stale={summaryStale && history.length > 0}/><TrafficChart history={history} stale={summaryStale && history.length > 0}/></div>
      </Suspense>
    </section>

    <section aria-label="Device health" className="dashboard-section">
      <div className="section-title-row"><div><div className="section-eyebrow">DEVICE WATCH</div><h2>Device health</h2></div><a className="section-link" href="#/devices">View all devices</a></div>
      <div className="health-panel">
        <div className="health-panel-top"><span>Five fictional network endpoints</span><span>{devicesStale && devices && <StaleBadge/>}{devicesUpdatedAt ? `Last received ${formatTime(devicesUpdatedAt)}` : 'Waiting for data'}</span></div>
        {!devices ? <FeedbackPanel loading={connection === 'loading'} title={connection === 'loading' ? 'Loading devices' : 'Devices unavailable'} message={connection === 'loading' ? 'Connecting to the FastAPI backend.' : 'Start the backend and the dashboard will retry automatically.'}/> :
          devices.length === 0 ? <FeedbackPanel title="No devices returned" message="The monitoring API returned an empty list."/> :
          <div className="health-list">{devices.map((device) => <div className="health-row" key={device.device_id}>
            <div className="health-device"><div className="health-device-icon">{device.device_type === 'computer' ? 'PC' : device.device_type.slice(0, 2).toUpperCase()}</div><div><strong>{device.device_name}</strong><span>{device.ip_address} · {device.device_type}</span></div></div>
            <div className="health-reading">{formatMetric(device.latency_ms, 'ms')}{devicesStale && <span>Stale</span>}</div>
            <StatusBadge status={device.status}/>
          </div>)}</div>}
      </div>
    </section>
  </>
}
