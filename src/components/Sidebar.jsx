import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BrandLogo from './BrandLogo'
import Button from './Button'
import { adminNavItems, userNavItems } from '../routes/navigation'

const Sidebar = ({ collapsed, onCollapse, mobileOpen, onClose, role = 'user' }) => {
  const navItems = role === 'admin' ? adminNavItems : userNavItems

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-overlay/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full flex-col border-r border-border-subtle bg-bg-secondary transition-all duration-300 dark:border-border-strong lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="flex flex-col gap-3 px-5 py-6">
          <div className="flex items-center justify-between">
            <BrandLogo label={!collapsed} />
            <button
              type="button"
              className="hidden rounded-full border border-border-subtle p-1 text-text-muted transition hover:text-text-primary dark:border-border-strong lg:inline-flex"
              onClick={onCollapse}
              aria-label="Toggle collapse"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                  role === 'admin'
                    ? 'bg-accent-soft text-accent-strong'
                    : 'bg-brand-soft text-brand-700'
                }`}
              >
                {role === 'admin' ? 'Admin Console' : 'User Workspace'}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 px-4">
          <p
            className={`mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-text-muted ${
              collapsed ? 'text-center' : ''
            }`}
          >
            {role === 'admin' ? 'Admin' : 'Workspace'}
          </p>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-100 text-text-primary border border-brand-200/60'
                      : 'text-text-secondary hover:bg-bg-card/80 dark:text-text-secondary dark:hover:bg-bg-card/60'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                <item.icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-5">
          <div className="rounded-2xl border border-border-subtle bg-bg-card px-4 py-5 shadow-soft dark:border-border-strong">
            <p className="text-xs uppercase tracking-widest text-text-muted">
              Upgrade Plan
            </p>
            <p className="mt-2 text-sm font-semibold text-text-primary">
              Unlock smart ledger automations.
            </p>
            {!collapsed && (
              <Button className="mt-4 w-full" variant="primary">
                Explore Plus
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
