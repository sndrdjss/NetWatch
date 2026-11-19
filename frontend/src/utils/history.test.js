import { describe, expect, it } from 'vitest'
import { appendSummaryHistory, MAX_HISTORY_POINTS } from './history'

function summary(seconds) {
  return {
    last_checked: new Date(Date.UTC(2026, 0, 1, 0, 0, seconds)).toISOString(),
    average_latency_ms: seconds,
    total_incoming_mbps: seconds + 1,
    total_outgoing_mbps: seconds + 2,
  }
}

describe('live-session history', () => {
  it('adds only new backend timestamps and never fabricates points', () => {
    const first = appendSummaryHistory([], summary(0))
    expect(first).toHaveLength(1)
    expect(appendSummaryHistory(first, summary(0))).toBe(first)
    expect(appendSummaryHistory(first, summary(10))).toHaveLength(2)
  })

  it('keeps only the latest 60 received samples', () => {
    let history = []
    for (let i = 0; i < MAX_HISTORY_POINTS + 2; i += 1) {
      history = appendSummaryHistory(history, {
        ...summary(0),
        last_checked: new Date(Date.UTC(2026, 0, 1, 0, 0, i * 10)).toISOString(),
      })
    }
    expect(history).toHaveLength(MAX_HISTORY_POINTS)
    expect(history[0].latency_ms).toBe(0)
  })
})
