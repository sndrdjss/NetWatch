import { expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { DevicesPage } from './DevicesPage'

const devices = [
  { device_id: 'router-01', device_name: 'Router-01', device_type: 'router', ip_address: '192.0.2.1', status: 'Online', latency_ms: 5, uptime_percent: 99.9, incoming_mbps: 12, outgoing_mbps: 7, last_checked: '2026-01-01T00:00:00Z', simulated: true },
  { device_id: 'pc-02', device_name: 'PC-02', device_type: 'computer', ip_address: '192.0.2.5', status: 'Offline', latency_ms: null, uptime_percent: 95.5, incoming_mbps: 0, outgoing_mbps: 0, last_checked: '2026-01-01T00:00:00Z', simulated: true },
]

it('filters the visible device inventory', () => {
  render(<DevicesPage monitoring={{ devices, connection: 'live', devicesStale: false, devicesUpdatedAt: null }}/>)
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'router' } })
  expect(screen.getByText(/Showing 1 of 2 devices/)).toBeTruthy()
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Offline' } })
  expect(screen.getByText('No matching devices')).toBeTruthy()
})

it('shows an empty response clearly', () => {
  render(<DevicesPage monitoring={{ devices: [], connection: 'live', devicesStale: false, devicesUpdatedAt: null }}/>)
  expect(screen.getByText('No devices returned')).toBeTruthy()
})
