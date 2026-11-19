export const MAX_HISTORY_POINTS = 60

export function appendSummaryHistory(history, summary) {
  const last = history.at(-1)
  if (last && Date.parse(summary.last_checked) <= Date.parse(last.last_checked)) return history

  return [...history, {
    last_checked: summary.last_checked,
    latency_ms: summary.average_latency_ms,
    incoming_mbps: summary.total_incoming_mbps,
    outgoing_mbps: summary.total_outgoing_mbps,
  }].slice(-MAX_HISTORY_POINTS)
}
