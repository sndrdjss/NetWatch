const apiBase = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '')

async function readJson(path, signal) {
  const response = await fetch(`${apiBase}${path}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal,
  })

  if (!response.ok) {
    throw new Error(`Monitoring API returned ${response.status}`)
  }

  return response.json()
}

export async function getSummary(signal) {
  const data = await readJson('/summary', signal)
  const numberKeys = [
    'total_devices', 'online_devices', 'offline_devices', 'warning_devices',
    'average_uptime_percent', 'total_incoming_mbps', 'total_outgoing_mbps',
  ]

  if (!data || typeof data !== 'object' || !numberKeys.every((key) => Number.isFinite(data[key])) ||
      (data.average_latency_ms !== null && !Number.isFinite(data.average_latency_ms)) ||
      typeof data.last_checked !== 'string' || !Number.isFinite(Date.parse(data.last_checked)) || data.simulated !== true) {
    throw new Error('Monitoring API returned an invalid summary')
  }

  return data
}

export async function getDevices(signal) {
  const data = await readJson('/devices', signal)
  if (!Array.isArray(data) || !data.every((device) =>
    device && typeof device.device_id === 'string' && typeof device.device_name === 'string' &&
    typeof device.device_type === 'string' && typeof device.ip_address === 'string' &&
    ['Online', 'Warning', 'Offline'].includes(device.status) &&
    (device.latency_ms === null || Number.isFinite(device.latency_ms)) &&
    Number.isFinite(device.uptime_percent) && Number.isFinite(device.incoming_mbps) &&
    Number.isFinite(device.outgoing_mbps) && typeof device.last_checked === 'string' &&
    Number.isFinite(Date.parse(device.last_checked)) &&
    device.simulated === true
  )) {
    throw new Error('Monitoring API returned an invalid device list')
  }

  return data
}
