import { useState, useRef, useEffect } from 'react'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProfileMenu = () => {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-card/80 px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-accent-strong hover:text-text-primary dark:border-border-strong"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-on-brand">
          {user?.name?.split(' ').map((word) => word[0]).join('') || 'TF'}
        </span>
        <span className="hidden text-left md:block">
          <span className="block text-sm font-semibold text-text-primary">
            {user?.name || 'TrackFin User'}
          </span>
          <span className="block text-xs text-text-muted">{user?.role || 'Member'}</span>
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-border-subtle bg-bg-card p-3 shadow-soft dark:border-border-strong">
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-secondary transition hover:bg-bg-secondary/70 dark:hover:bg-bg-secondary/40"
            onClick={() => setOpen(false)}
          >
            <User className="h-4 w-4" />
            View Profile
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin/settings"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-secondary transition hover:bg-bg-secondary/70 dark:hover:bg-bg-secondary/40"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          )}
          <button
            type="button"
            onClick={logout}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-blush-500 transition hover:bg-blush-50 dark:hover:bg-blush-500/10"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
