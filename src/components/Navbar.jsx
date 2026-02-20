import { Bell, Menu } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import ProfileMenu from './ProfileMenu'

const Navbar = ({ onMenuClick, role = 'user' }) => (
  <header className="app-navbar sticky-top z-2 d-flex align-items-center justify-content-between border-bottom border-secondary-subtle bg-app-card px-3 py-2 px-sm-4">
    <div className="d-flex align-items-center gap-2 gap-sm-3 min-w-0">
      <button
        type="button"
        className="btn-icon d-inline-flex d-lg-none align-items-center justify-content-center rounded-3 border border-secondary-subtle text-secondary bg-transparent"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Menu size={18} />
      </button>
      <div className="min-w-0">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="navbar-title-long fw-semibold text-uppercase text-app-muted fs-7 letter-space-wide text-truncate d-none d-sm-inline">
            {role === 'admin' ? 'Admin Console' : 'Financial command center'}
          </span>
          <span className="navbar-title-short fw-semibold text-uppercase text-app-muted fs-7 d-inline d-sm-none">
            TrackFin
          </span>
          <span className={`badge rounded-pill px-2 py-1 fs-7 ${role === 'admin' ? 'text-bg-danger' : 'text-bg-success'}`}>
            {role === 'admin' ? 'Admin' : 'User'}
          </span>
        </div>
        <p className="mb-0 fw-semibold text-app-primary small text-truncate d-none d-sm-block">
          {role === 'admin' ? 'Administrative workspace' : 'Welcome back to TrackFin'}
        </p>
      </div>
    </div>
    <div className="d-flex align-items-center gap-1 gap-sm-2 flex-shrink-0">
      <button
        type="button"
        className="btn-icon nav-notification position-relative d-flex align-items-center justify-content-center rounded-3 border border-secondary-subtle text-secondary bg-transparent"
        aria-label="Notifications"
      >
        <Bell size={18} />
        <span className="position-absolute top-0 end-0 mt-2 me-2 p-1 rounded-circle bg-success" />
      </button>
      <ThemeToggle />
      <ProfileMenu />
    </div>
  </header>
)

export default Navbar
