import { Icon } from './Icon'

export const navigation = [
  { slug: 'dashboard', label: 'Dashboard', icon: 'dashboard', ready: true },
  { slug: 'devices', label: 'Devices', icon: 'devices', ready: true },
  { slug: 'performance', label: 'Performance', icon: 'performance' },
  { slug: 'alerts', label: 'Alerts', icon: 'alerts' },
  { slug: 'network-topology', label: 'Network Topology', icon: 'topology' },
  { slug: 'settings', label: 'Settings', icon: 'settings' },
]

export function Sidebar({ route, open, onClose }) {
  return <>
    {open && <button className="sidebar-scrim lg:hidden" aria-label="Close navigation" onClick={onClose} />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} aria-label="Main navigation">
      <div className="sidebar-brand">
        <div className="brand-mark"><Icon name="wifi" size={25} /></div>
        <div>
          <div className="brand-name">NetWatch<span>.</span></div>
          <div className="brand-subtitle">NETWORK OPERATIONS</div>
        </div>
        <button className="sidebar-close lg:hidden" aria-label="Close navigation" onClick={onClose}><Icon name="close" /></button>
      </div>

      <div className="sidebar-section-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Primary">
        {navigation.map((item) => <a
          key={item.slug}
          href={`#/${item.slug}`}
          onClick={onClose}
          aria-current={route === item.slug ? 'page' : undefined}
          className={`nav-link ${route === item.slug ? 'nav-link-active' : ''}`}
        >
          <Icon name={item.icon} size={19} />
          <span>{item.label}</span>
          {!item.ready && <span className="nav-soon">SOON</span>}
        </a>)}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-system-dot" />
        <div><strong>Simulation mode</strong><span>Fictional network devices</span></div>
      </div>
    </aside>
  </>
}
