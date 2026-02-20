import { Link } from 'react-router-dom'
import Card from '../components/Card'

const NotFound = () => (
  <div className="min-vh-100 d-flex align-items-center justify-content-center px-3">
    <Card className="text-center" style={{ maxWidth: '28rem' }}>
      <p className="small text-uppercase letter-space-wide text-app-muted mb-2">404</p>
      <h1 className="h2 fw-semibold text-app-primary mb-3">Page not found</h1>
      <p className="text-app-secondary mb-4">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn btn-success text-white rounded-3 px-4">
        Back to dashboard
      </Link>
    </Card>
  </div>
)

export default NotFound
