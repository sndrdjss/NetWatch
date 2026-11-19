import { useEffect, useState } from 'react'
import { getDevices, getSummary } from '../api/client'
import { appendSummaryHistory } from '../utils/history'

const POLL_MS = 10_000

export function useMonitoring() {
  const [summary, setSummary] = useState(null)
  const [devices, setDevices] = useState(null)
  const [history, setHistory] = useState([])
  const [connection, setConnection] = useState('loading')
  const [summaryError, setSummaryError] = useState(null)
  const [devicesError, setDevicesError] = useState(null)
  const [summaryUpdatedAt, setSummaryUpdatedAt] = useState(null)
  const [devicesUpdatedAt, setDevicesUpdatedAt] = useState(null)
  const [lastSuccessfulUpdate, setLastSuccessfulUpdate] = useState(null)

  useEffect(() => {
    let disposed = false
    let inFlight = false
    let controller = null

    async function poll() {
      if (inFlight) return
      inFlight = true
      controller = new AbortController()

      const [summaryResult, devicesResult] = await Promise.allSettled([
        getSummary(controller.signal),
        getDevices(controller.signal),
      ])
      inFlight = false
      if (disposed) return

      const receivedAt = new Date().toISOString()
      const summaryOk = summaryResult.status === 'fulfilled'
      const devicesOk = devicesResult.status === 'fulfilled'

      if (summaryOk) {
        setSummary(summaryResult.value)
        setHistory((current) => appendSummaryHistory(current, summaryResult.value))
        setSummaryUpdatedAt(receivedAt)
      }
      if (devicesOk) {
        setDevices(devicesResult.value)
        setDevicesUpdatedAt(receivedAt)
      }
      if (summaryOk || devicesOk) setLastSuccessfulUpdate(receivedAt)

      setSummaryError(summaryOk ? null : summaryResult.reason?.message || 'Summary unavailable')
      setDevicesError(devicesOk ? null : devicesResult.reason?.message || 'Devices unavailable')
      setConnection(summaryOk && devicesOk ? 'live' : summaryOk || devicesOk ? 'partial' : 'lost')
    }

    poll()
    const interval = window.setInterval(poll, POLL_MS)
    return () => {
      disposed = true
      window.clearInterval(interval)
      controller?.abort()
    }
  }, [])

  return {
    summary, devices, history, connection,
    summaryError, devicesError, summaryUpdatedAt, devicesUpdatedAt,
    lastSuccessfulUpdate,
    summaryStale: Boolean(summaryError),
    devicesStale: Boolean(devicesError),
  }
}
