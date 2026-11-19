import { expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DeviceTable } from './DeviceTable'

it('shows unavailable latency and separately labels stale device readings', () => {
  render(<DeviceTable stale devices={[{
    device_id: 'pc-02', device_name: 'PC-02', device_type: 'computer',
    ip_address: '192.0.2.5', status: 'Offline', latency_ms: null,
    uptime_percent: 95.5, incoming_mbps: 0, outgoing_mbps: 0,
    last_checked: '2026-01-01T00:00:00Z', simulated: true,
  }]}/>)

  expect(screen.getAllByText('Offline').length).toBeGreaterThan(0)
  expect(screen.getAllByText('—').length).toBeGreaterThan(0)
  expect(screen.getAllByText(/Stale/i).length).toBeGreaterThan(0)
  expect(screen.getAllByText('0.0 Mbps').length).toBeGreaterThan(0)
})
