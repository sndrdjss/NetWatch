import { expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardPage } from './DashboardPage'

it('labels retained summary and device sections as stale', () => {
  render(<DashboardPage monitoring={{
    summary: {
      total_devices: 1, online_devices: 1, warning_devices: 0,
      offline_devices: 0, average_latency_ms: 8,
      total_incoming_mbps: 12, total_outgoing_mbps: 7,
      last_checked: '2026-01-01T00:00:00Z', simulated: true,
    },
    devices: [{
      device_id: 'router-01', device_name: 'Router-01', device_type: 'router',
      ip_address: '192.0.2.1', status: 'Online', latency_ms: 8,
    }],
    history: [], connection: 'lost', summaryStale: true, devicesStale: true,
    summaryUpdatedAt: '2026-01-01T00:00:00Z', devicesUpdatedAt: '2026-01-01T00:00:00Z',
  }}/>)

  expect(screen.getAllByText('STALE').length).toBeGreaterThanOrEqual(7)
  expect(screen.getByText('Router-01')).toBeTruthy()
  expect(screen.getByText('Stale')).toBeTruthy()
})
