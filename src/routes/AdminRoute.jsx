import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminRoute = ({ children }) => {
  const { user, loading, authGuardEnabled } = useAuth()
  const hasAdminRole =
    user?.role?.toLowerCase?.() === 'admin' ||
    user?.roles?.some?.((role) => String(role).toLowerCase() === 'admin')

  if (!authGuardEnabled) {
    return children
  }

  if (loading) {
    return <LoadingSpinner label="Checking access" />
  }

  if (!hasAdminRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
