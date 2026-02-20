import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const UserLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 992px)').matches : true
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 992px)')

    const handleChange = (event) => {
      setIsDesktop(event.matches)
      if (event.matches) {
        setMobileOpen(false)
      }
    }

    setIsDesktop(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const effectiveCollapsed = isDesktop ? collapsed : false

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={effectiveCollapsed}
        onCollapse={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        role="user"
      />

      <div className={`main-content d-flex flex-column ${effectiveCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <Navbar onMenuClick={() => setMobileOpen(true)} role="user" />
        <main className="p-3 p-sm-4 p-lg-5 flex-grow-1">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default UserLayout
