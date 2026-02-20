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

  const initials = user?.name
    ?.split(' ')
    .map((word) => word[0])
    .join('')

  return (
    <div className="position-relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="profile-trigger d-flex align-items-center gap-2 rounded-3 border border-secondary-subtle px-2 px-sm-3 py-2 bg-body text-secondary"
      >
        <span className="btn-icon-sm d-flex align-items-center justify-content-center rounded-circle bg-success text-white fw-semibold small">
          {initials || 'TF'}
        </span>
        <span className="d-none d-md-block text-start">
          <span className="d-block fw-semibold text-app-primary small">{user?.name || 'TrackFin User'}</span>
          <span className="d-block text-app-muted" style={{ fontSize: '0.72rem' }}>
            {user?.role || 'Member'}
          </span>
        </span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="profile-dropdown dropdown-menu show position-absolute end-0 mt-2 border border-secondary-subtle p-2 shadow-sm bg-app-card">
          <Link
            to="/profile"
            className="profile-dropdown-item dropdown-item d-flex align-items-center gap-2 px-3 py-2 text-secondary"
            onClick={() => setOpen(false)}
          >
            <User size={16} />
            View Profile
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin/settings"
              className="profile-dropdown-item dropdown-item d-flex align-items-center gap-2 px-3 py-2 text-secondary"
              onClick={() => setOpen(false)}
            >
              <Settings size={16} />
              Settings
            </Link>
          )}
          <div className="dropdown-divider my-2" />
          <button
            type="button"
            onClick={logout}
            className="profile-dropdown-item dropdown-item d-flex w-100 align-items-center gap-2 px-3 py-2 text-danger"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
