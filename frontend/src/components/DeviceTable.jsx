import { formatMetric, formatTime } from '../utils/format'
import { StaleBadge, StatusBadge } from './StatusBadge'

function deviceType(type) {
  return type === 'computer' ? 'Computer' : type.charAt(0).toUpperCase() + type.slice(1)
}

export function DeviceTable({ devices, stale }) {
  return <>
    <div className="device-table-wrap">
      <table className="device-table">
        <thead><tr>
          <th scope="col">Device name</th><th scope="col">Type</th><th scope="col">IP address</th>
          <th scope="col">Status</th><th scope="col">Latency</th><th scope="col">Uptime</th>
          <th scope="col">Incoming</th><th scope="col">Outgoing</th><th scope="col">Last checked (local)</th>
        </tr></thead>
        <tbody>{devices.map((device) => <tr key={device.device_id}>
          <td><div className="device-name-cell"><span className="device-avatar">{device.device_type === 'computer' ? 'PC' : device.device_type.slice(0, 2).toUpperCase()}</span><div><strong>{device.device_name}</strong><small>{device.device_id}{stale && <> · <span className="text-amber-300">Stale</span></>}</small></div></div></td>
          <td>{deviceType(device.device_type)}</td>
          <td className="mono-value">{device.ip_address}</td>
          <td><StatusBadge status={device.status}/></td>
          <td>{formatMetric(device.latency_ms, 'ms')}</td>
          <td>{formatMetric(device.uptime_percent, '%')}</td>
          <td>{formatMetric(device.incoming_mbps, 'Mbps')}</td>
          <td>{formatMetric(device.outgoing_mbps, 'Mbps')}</td>
          <td className="last-checked-cell">{formatTime(device.last_checked)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <div className="device-mobile-list">{devices.map((device) => <article className="device-mobile-card" key={device.device_id}>
      <div className="device-mobile-head"><div><strong>{device.device_name}</strong><span>{deviceType(device.device_type)} · {device.ip_address}</span></div><StatusBadge status={device.status}/></div>
      {stale && <div className="mt-3"><StaleBadge/></div>}
      <dl className="device-mobile-metrics">
        <div><dt>Latency</dt><dd>{formatMetric(device.latency_ms, 'ms')}</dd></div>
        <div><dt>Uptime</dt><dd>{formatMetric(device.uptime_percent, '%')}</dd></div>
        <div><dt>Incoming</dt><dd>{formatMetric(device.incoming_mbps, 'Mbps')}</dd></div>
        <div><dt>Outgoing</dt><dd>{formatMetric(device.outgoing_mbps, 'Mbps')}</dd></div>
      </dl>
      <div className="device-mobile-checked">Last checked (local): {formatTime(device.last_checked)}</div>
    </article>)}</div>
  </>
}
