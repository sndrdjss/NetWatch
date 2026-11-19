import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatChartTime, formatMetric } from '../utils/format'
import { StaleBadge } from './StatusBadge'

const axisStyle = { fill: '#8394ab', fontSize: 12 }
const tooltipStyle = { background: '#111e2f', border: '1px solid #2b4059', borderRadius: 12, color: '#ecf5ff' }

function ChartFrame({ children, history, stale, title, subtitle, legend }) {
  return <section className="chart-card">
    <div className="chart-heading">
      <div><div className="section-eyebrow">LIVE SESSION HISTORY</div><h3>{title}</h3><p>{subtitle}</p></div>
      {stale && <StaleBadge />}
    </div>
    {legend && <div className="chart-legend">{legend}</div>}
    {history.length === 0 ? <div className="chart-empty">Waiting for the first successful API snapshot.</div> : <>
      <div className="chart-canvas">{children}</div>
      <div className="chart-footer">{history.length === 1 ? 'One snapshot collected. The trend will appear after the next update.' : `${history.length} snapshots collected this session.`}{stale && ' No new points while data is unavailable.'}</div>
    </>}
  </section>
}

export function LatencyChart({ history, stale }) {
  const hasLatency = history.some((point) => Number.isFinite(point.latency_ms))
  return <ChartFrame history={history} stale={stale} title="Average latency" subtitle="Reachable devices · milliseconds" legend={<span><i className="legend-swatch legend-cyan" />Latency</span>}>
    {hasLatency ? <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={history} margin={{ top: 14, right: 12, left: -18, bottom: 0 }}>
        <defs><linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.24}/><stop offset="100%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient></defs>
        <CartesianGrid stroke="#25364a" strokeDasharray="3 5" vertical={false} />
        <XAxis dataKey="last_checked" tickFormatter={formatChartTime} tick={axisStyle} axisLine={false} tickLine={false} minTickGap={28}/>
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={46} unit="ms" domain={[0, 'auto']}/>
        <Tooltip contentStyle={tooltipStyle} labelFormatter={formatChartTime} formatter={(value) => [formatMetric(value, 'ms', 1), 'Average latency']}/>
        <Area type="monotone" dataKey="latency_ms" stroke="#22d3ee" strokeWidth={2.5} fill="url(#latencyFill)" connectNulls={false} dot={history.length < 4} activeDot={{ r: 5 }} isAnimationActive={false}/>
      </AreaChart>
    </ResponsiveContainer> : <div className="chart-no-metric">Latency unavailable while all monitored devices are offline.</div>}
  </ChartFrame>
}

export function TrafficChart({ history, stale }) {
  return <ChartFrame history={history} stale={stale} title="Network traffic" subtitle="Combined device traffic · Mbps" legend={<><span><i className="legend-swatch legend-blue" />Incoming</span><span><i className="legend-swatch legend-purple" />Outgoing</span></>}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={history} margin={{ top: 14, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="#25364a" strokeDasharray="3 5" vertical={false} />
        <XAxis dataKey="last_checked" tickFormatter={formatChartTime} tick={axisStyle} axisLine={false} tickLine={false} minTickGap={28}/>
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={50} domain={[0, 'auto']}/>
        <Tooltip contentStyle={tooltipStyle} labelFormatter={formatChartTime} formatter={(value, name) => [formatMetric(value, 'Mbps', 1), name === 'incoming_mbps' ? 'Incoming' : 'Outgoing']}/>
        <Line type="monotone" dataKey="incoming_mbps" name="incoming_mbps" stroke="#60a5fa" strokeWidth={2.5} dot={history.length < 4} activeDot={{ r: 5 }} isAnimationActive={false}/>
        <Line type="monotone" dataKey="outgoing_mbps" name="outgoing_mbps" stroke="#a78bfa" strokeWidth={2.5} dot={history.length < 4} activeDot={{ r: 5 }} isAnimationActive={false}/>
      </LineChart>
    </ResponsiveContainer>
  </ChartFrame>
}
