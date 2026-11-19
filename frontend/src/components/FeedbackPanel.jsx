export function FeedbackPanel({ title, message, loading = false }) {
  return <div className={`feedback-panel ${loading ? 'feedback-loading' : ''}`} role={loading ? 'status' : 'alert'}>
    <div className="feedback-icon">{loading ? '···' : '!'}</div>
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
}
