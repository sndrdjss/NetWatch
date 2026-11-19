import { Icon } from '../components/Icon'

export function ComingSoonPage({ title, icon }) {
  return <>
    <div className="page-heading"><div><div className="page-kicker">NETWATCH / ROADMAP</div><h1>{title}</h1><p>This workspace section is planned for a later phase.</p></div></div>
    <div className="coming-soon-card"><div className="coming-soon-icon"><Icon name={icon} size={34}/></div><span className="soon-label">COMING SOON</span><h2>{title} is on the roadmap</h2><p>NetWatch Phase 3 focuses on the Dashboard and Devices views. This section has no live feature yet.</p><a href="#/dashboard" className="primary-link">Return to Dashboard</a></div>
  </>
}
