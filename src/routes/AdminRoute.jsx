import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminRoute = ({ children }) => {
  const { user, loading, authGuardEnabled } = useAuth()

  if (!authGuardEnabled) {
    return children
  }

  if (loading) {
    return <LoadingSpinner label="Checking access" />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
