import { Bell, Menu } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import ProfileMenu from './ProfileMenu'

const Navbar = ({ onMenuClick, role = 'user' }) => (
  <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border-subtle bg-bg-card px-4 py-4 transition dark:border-border-strong sm:px-6">
    <div className="flex items-center gap-4">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle text-text-secondary transition hover:border-accent-strong hover:text-text-primary dark:border-border-strong lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-4 w-4" />
      </button>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            {role === 'admin' ? 'Admin Console' : 'Financial command center'}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              role === 'admin'
                ? 'bg-accent-soft text-accent-strong'
                : 'bg-brand-soft text-brand-700'
            }`}
          >
            {role === 'admin' ? 'Admin' : 'User'}
          </span>
        </div>
        <p className="text-sm font-semibold text-text-primary">
          {role === 'admin' ? 'Administrative workspace' : 'Welcome back to TrackFin'}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle text-text-secondary transition hover:border-accent-strong hover:text-text-primary dark:border-border-strong"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
      </button>
      <ThemeToggle />
      <ProfileMenu />
    </div>
  </header>
)

export default Navbar
