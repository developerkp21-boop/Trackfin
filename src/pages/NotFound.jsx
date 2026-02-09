import { Link } from 'react-router-dom'
import Card from '../components/Card'

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center px-6">
    <Card className="max-w-md text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-ink-400">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-ink-900 dark:text-on-brand">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-ink-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-button-primary px-4 py-2.5 text-sm font-semibold text-button-text shadow-soft transition hover:bg-button-hover"
      >
        Back to dashboard
      </Link>
    </Card>
  </div>
)

export default NotFound
