import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import BrandLogo from './BrandLogo'
import Button from './Button'
import { adminNavItems, userNavItems } from '../routes/navigation'

const userNavGroups = [
  {
    label: 'Overview',
    items: userNavItems.slice(0, 1)
  },
  {
    label: 'Finance',
    items: userNavItems.slice(1, 5)
  },
  {
    label: 'Planning',
    items: userNavItems.slice(5, 9)
  },
  {
    label: 'Analytics',
    items: userNavItems.slice(9, 11)
  },
  {
    label: 'Account',
    items: userNavItems.slice(11)
  }
]

const Sidebar = ({ collapsed, onCollapse, mobileOpen, onClose, role = 'user' }) => {
  const isAdmin = role === 'admin'
  const navGroups = isAdmin
    ? [{ label: 'Admin', items: adminNavItems }]
    : userNavGroups

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="position-fixed top-0 start-0 w-100 h-100 z-2 bg-dark bg-opacity-50 d-lg-none border-0"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`app-sidebar position-fixed top-0 start-0 z-3 h-100 d-flex flex-column border-end border-secondary-subtle bg-body-tertiary ${mobileOpen ? 'is-open' : ''} ${collapsed ? 'is-collapsed' : ''}`}
      >
        {/* Header */}
        <div className="d-flex flex-column gap-2 px-3 pt-4 pb-3 flex-shrink-0">
          <div className="d-flex align-items-center justify-content-between">
            <BrandLogo label={!collapsed} />
            <button
              type="button"
              className="d-inline-flex d-lg-none align-items-center justify-content-center rounded-circle border border-secondary-subtle p-1 text-secondary bg-transparent"
              onClick={onClose}
              aria-label="Close sidebar"
              style={{ width: '1.8rem', height: '1.8rem' }}
            >
              <X size={14} />
            </button>
            <button
              type="button"
              className="d-none d-lg-inline-flex align-items-center justify-content-center rounded-circle border border-secondary-subtle p-1 text-secondary bg-transparent"
              onClick={onCollapse}
              aria-label="Toggle collapse"
              style={{ width: '1.6rem', height: '1.6rem' }}
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>
          {!collapsed && (
            <span className={`badge rounded-pill px-2 py-1 text-uppercase fs-7 ${isAdmin ? 'text-bg-danger' : 'text-bg-success'}`}>
              {isAdmin ? 'Admin Console' : 'User Workspace'}
            </span>
          )}
        </div>

        {/* Scrollable Nav */}
        <div className="flex-grow-1 px-2 px-lg-3 sidebar-nav-scroll" style={{ overflowY: 'auto' }}>
          {navGroups.map((group) => (
            <div key={group.label} className="mb-2">
              {!collapsed && (
                <p className="sidebar-group-label mb-1">{group.label}</p>
              )}
              <nav className="d-flex flex-column gap-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    end
                    onClick={onClose}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `d-flex align-items-center gap-3 rounded-3 px-3 py-2 text-decoration-none transition-smooth ${
                        isActive
                          ? 'bg-success-subtle text-success border border-success-subtle'
                          : 'text-app-secondary'
                      } ${collapsed ? 'justify-content-center' : ''}`
                    }
                  >
                    <item.icon size={16} className="flex-shrink-0" />
                    {!collapsed && <span className="small fw-medium text-truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Upgrade CTA */}
        {!collapsed && !isAdmin && (
          <div className="p-3 flex-shrink-0">
            <div className="rounded-4 border border-secondary-subtle bg-app-card p-3 shadow-sm">
              <p className="text-uppercase text-app-secondary m-0 fs-7">Upgrade Plan</p>
              <p className="mt-2 mb-3 fw-semibold text-app-primary small">Unlock smart ledger automations.</p>
              <Button className="w-100" variant="primary">Explore Plus</Button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
