import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useMonitoring } from './useMonitoring'
import { getDevices, getSummary } from '../api/client'

vi.mock('../api/client', () => ({ getDevices: vi.fn(), getSummary: vi.fn() }))

const firstSummary = {
  last_checked: '2026-01-01T00:00:00Z', average_latency_ms: 12,
  total_incoming_mbps: 30, total_outgoing_mbps: 20,
}
const secondSummary = { ...firstSummary, last_checked: '2026-01-01T00:00:20Z', average_latency_ms: 14 }

beforeEach(() => {
  vi.useFakeTimers()
  vi.clearAllMocks()
})
afterEach(() => vi.useRealTimers())

it('keeps last readings stale during disconnection and restores live data on recovery', async () => {
  getSummary.mockResolvedValueOnce(firstSummary).mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce(secondSummary)
  getDevices.mockResolvedValueOnce([{ device_id: 'router-01' }]).mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce([{ device_id: 'router-01' }])

  const { result, unmount } = renderHook(() => useMonitoring())
  await act(async () => { await Promise.resolve() })
  expect(result.current.connection).toBe('live')
  expect(result.current.history).toHaveLength(1)

  await act(async () => { await vi.advanceTimersByTimeAsync(10_000) })
  expect(result.current.connection).toBe('lost')
  expect(result.current.summaryStale).toBe(true)
  expect(result.current.devicesStale).toBe(true)
  expect(result.current.summary).toEqual(firstSummary)
  expect(result.current.history).toHaveLength(1)
  expect(result.current.lastSuccessfulUpdate).not.toBeNull()

  await act(async () => { await vi.advanceTimersByTimeAsync(10_000) })
  expect(result.current.connection).toBe('live')
  expect(result.current.summaryStale).toBe(false)
  expect(result.current.history).toHaveLength(2)
  unmount()
  expect(vi.getTimerCount()).toBe(0)
})

it('marks only the failed endpoint stale during partial availability', async () => {
  getSummary.mockResolvedValueOnce(firstSummary)
  getDevices.mockRejectedValueOnce(new Error('Devices unavailable'))
  const { result, unmount } = renderHook(() => useMonitoring())
  await act(async () => { await Promise.resolve() })
  expect(result.current.connection).toBe('partial')
  expect(result.current.summaryStale).toBe(false)
  expect(result.current.devicesStale).toBe(true)
  expect(result.current.history).toHaveLength(1)
  unmount()
})
