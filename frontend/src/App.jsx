import { useEffect, useState } from 'react'
import { ConnectionBanner, ConnectionStatus } from './components/ConnectionStatus'
import { Icon } from './components/Icon'
import { Sidebar, navigation } from './components/Sidebar'
import { useMonitoring } from './hooks/useMonitoring'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { DashboardPage } from './pages/DashboardPage'
import { DevicesPage } from './pages/DevicesPage'

function getRoute() {
  const slug = window.location.hash.replace(/^#\/?/, '')
  return navigation.some((item) => item.slug === slug) ? slug : 'dashboard'
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [mobileOpen, setMobileOpen] = useState(false)
  const monitoring = useMonitoring()

  useEffect(() => {
    function onHashChange() {
      setRoute(getRoute())
      setMobileOpen(false)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const current = navigation.find((item) => item.slug === route)

  return <div className="app-shell">
    <Sidebar route={route} open={mobileOpen} onClose={() => setMobileOpen(false)}/>
    <div className="main-area">
      <header className="topbar">
        <div className="topbar-left"><button className="menu-button lg:hidden" aria-label="Open navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Icon name="menu"/></button><span className="topbar-breadcrumb">NETWATCH <span>/</span> {current.label.toUpperCase()}</span></div>
        <div className="topbar-right"><span className="simulation-tag">SIMULATED DATA</span><ConnectionStatus connection={monitoring.connection}/></div>
      </header>
      <main className="content-area">
        <ConnectionBanner connection={monitoring.connection} lastSuccessfulUpdate={monitoring.lastSuccessfulUpdate}/>
        {route === 'dashboard' ? <DashboardPage monitoring={monitoring}/> : route === 'devices' ? <DevicesPage monitoring={monitoring}/> : <ComingSoonPage title={current.label} icon={current.icon}/>}
        <footer className="page-footer"><span>NETWATCH // NETWORK MONITORING DASHBOARD</span><span>Fictional devices · Local simulation</span></footer>
      </main>
    </div>
  </div>
}
