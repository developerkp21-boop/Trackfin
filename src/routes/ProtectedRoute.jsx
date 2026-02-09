import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, authGuardEnabled } = useAuth()
  const location = useLocation()

  if (!authGuardEnabled) {
    return children
  }

  if (loading) {
    return <LoadingSpinner label="Checking session" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
