import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const DashboardLayout = () => {
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar
        collapsed={collapsed}
        onCollapse={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        role={user?.role}
      />
      <div
        className={`min-h-screen bg-bg-primary transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} role={user?.role || 'user'} />
        <main className="px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
